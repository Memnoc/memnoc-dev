import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import sharp from 'sharp';

const command = resolve('scripts/check-images.mjs');

async function workspace(t) {
  const root = await mkdtemp(join(tmpdir(), 'blog-image-audit-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'src/content/blog'), { recursive: true });
  return root;
}

async function put(root, name, content) {
  await mkdir(dirname(join(root, name)), { recursive: true });
  await writeFile(join(root, name), content);
}

function run(root, ...args) {
  const result = spawnSync(process.execPath, [command, '--json', ...args], { cwd: root, encoding: 'utf8' });
  assert.ifError(result.error);
  return { ...result, report: JSON.parse(result.stdout) };
}

test('audit finds missing frontmatter and reference-style images without flagging code examples', async t => {
  const root = await workspace(t);
  await put(root, 'src/content/blog/example.md', `---
title: Example
image: ../../assets/blog/example/missing-cover.jpg
---
![Diagram][diagram]

[diagram]: ../../assets/blog/example/missing-diagram.png

\`\`\`markdown
![Only an example](missing-example.png)
\`\`\`
`);
  const { status, report } = run(root, '--source-only');
  assert.equal(status, 1);
  assert.equal(report.errors.length, 2);
  assert.match(report.errors.join('\n'), /missing-cover\.jpg/);
  assert.match(report.errors.join('\n'), /missing-diagram\.png/);
  assert.doesNotMatch(report.errors.join('\n'), /missing-example/);
});

test('audit measures sources and generated variants, resolves encoded paths, and warns without fetching', async t => {
  const root = await workspace(t);
  const source = await sharp({ create: { width: 1700, height: 50, channels: 4, background: '#00000000' } }).png().toBuffer();
  await put(root, 'src/assets/blog/example/has space.png', source);
  await put(root, 'public/blog/legacy.png', source);
  await put(root, 'src/content/blog/example.md', `---
image: ../../assets/blog/example/has space.png
---
![A diagram](../../assets/blog/example/has%20space.png)
![Legacy](/blog/legacy.png)
![Remote](https://invalid.example/image.png)
`);
  const small = await sharp(source).resize(120).webp().toBuffer();
  const large = await sharp(source).resize(240).webp().toBuffer();
  await put(root, 'dist/_astro/cover-120.webp', small);
  await put(root, 'dist/_astro/cover-240.webp', large);
  await put(root, 'dist/writing/index.html', '<img class="post-thumb" src="/_astro/cover-120.webp" srcset="/_astro/cover-120.webp 120w, /_astro/cover-240.webp 240w" width="120" height="80" alt="">');
  const { status, report } = run(root, '--built');
  assert.equal(status, 0, JSON.stringify(report.errors));
  assert.equal(report.sources.length, 2);
  assert.deepEqual(report.outputs.map(image => image.width).sort((a, b) => a - b), [120, 240]);
  assert(report.outputs.every(image => image.uses.includes('thumbnail')));
  assert.match(report.warnings.join('\n'), /oversized source/);
  assert.match(report.warnings.join('\n'), /bypasses image optimization/);
  assert.match(report.warnings.join('\n'), /external image not audited/);
});

test('audit fails for missing raw-HTML and generated srcset images', async t => {
  const root = await workspace(t);
  await put(root, 'src/content/blog/example.md', '<img src="/blog/missing.png" alt="Example">');
  await put(root, 'dist/index.html', '<img src="/_astro/missing.webp" srcset="/_astro/missing-large.webp 800w" alt="Example">');
  const { status, report } = run(root, '--built');
  assert.equal(status, 1);
  assert.equal(report.errors.length, 3);
  assert.match(report.errors.join('\n'), /missing-large/);
});

test('audit requires a build when explicitly requested', async t => {
  const root = await workspace(t);
  const { status, report } = run(root, '--built');
  assert.equal(status, 1);
  assert.match(report.errors.join('\n'), /No build output/);
});

test('audit checks raw HTML responsive alternatives in source and built picture elements', async t => {
  const root = await workspace(t);
  const html = '<picture><source srcset="/blog/missing-wide.webp 800w, /blog/missing-huge.webp 1600w"><img src="data:image/png;base64,AAAA" srcset="data:image/png;base64,AAAA 1x, /blog/missing-retina.png 2x" alt="Example"></picture>';
  await put(root, 'src/content/blog/example.md', html);
  const source = run(root, '--source-only');
  assert.equal(source.status, 1);
  assert.equal(source.report.errors.length, 3);
  assert.match(source.report.errors.join('\n'), /missing-wide/);
  assert.match(source.report.errors.join('\n'), /missing-retina/);
  await put(root, 'dist/index.html', html);
  const built = run(root, '--built');
  assert.equal(built.report.errors.length, 6);
});
