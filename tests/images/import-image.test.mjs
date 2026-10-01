import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import sharp from 'sharp';

const command = resolve('scripts/import-image.mjs');

async function workspace(t) {
  const root = await mkdtemp(join(tmpdir(), 'blog-image-import-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

function run(root, args) {
  const result = spawnSync(process.execPath, [command, ...args], { cwd: root, encoding: 'utf8' });
  assert.ifError(result.error);
  return result;
}

test('author imports an oriented photograph without modifying its original', async t => {
  const root = await workspace(t);
  const source = join(root, 'My original.jpg');
  await sharp({ create: { width: 2400, height: 3200, channels: 3, background: '#b4637a' } })
    .withMetadata({ orientation: 6 }).jpeg().toFile(source);
  const original = await readFile(source);
  const result = run(root, [source, '--post', 'learning-c', '--name', 'cover', '--json']);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.path, 'src/assets/blog/learning-c/cover.jpg');
  assert.match(report.markdown, /\(\.\.\/\.\.\/assets\/blog\/learning-c\/cover\.jpg\)/);
  assert.match(report.frontmatter, /^image: /);
  const image = await sharp(join(root, report.path)).metadata();
  assert.equal(image.width, 1600);
  assert.equal(image.height, 1200);
  assert.equal(image.orientation, undefined);
  assert.equal(image.exif, undefined);
  assert.deepEqual(await readFile(source), original);
});

test('small transparent diagrams retain alpha and are never enlarged or overwritten', async t => {
  const root = await workspace(t);
  const source = join(root, 'diagram.png');
  await sharp({ create: { width: 80, height: 40, channels: 4, background: '#00000000' } }).png().toFile(source);
  const args = [source, '--post', 'learning-c', '--name', 'diagram', '--json'];
  const first = run(root, args);
  assert.equal(first.status, 0, first.stderr);
  const path = join(root, JSON.parse(first.stdout).path);
  const before = await readFile(path);
  const image = await sharp(path).metadata();
  assert.equal(image.width, 80);
  assert.equal(image.height, 40);
  assert.equal(image.hasAlpha, true);
  assert.equal((await sharp(path).raw().toBuffer())[3], 0);
  const second = run(root, args);
  assert.equal(second.status, 1);
  assert.match(second.stderr, /already exists/);
  assert.deepEqual(await readFile(path), before);
});

test('invalid names and missing or unsupported source files produce actionable errors', async t => {
  const root = await workspace(t);
  await writeFile(join(root, 'vector.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>');
  for (const [args, error] of [
    [['absent.jpg', '--post', '../escape', '--name', 'cover'], /--post must/],
    [['absent.jpg', '--post', 'learning-c', '--name', 'Cover'], /--name must/],
    [['absent.jpg', '--post', 'learning-c', '--name', 'cover'], /missing|not found/i],
    [['vector.svg', '--post', 'learning-c', '--name', 'cover'], /static JPEG, PNG, or WebP/],
  ]) {
    const result = run(root, args);
    assert.equal(result.status, 1);
    assert.match(result.stderr, error);
  }
});
