import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test, { beforeEach } from 'node:test';

import { refreshProjects } from '../../scripts/refresh-projects.mjs';

const repositories = ['Memnoc/CodeAtlas', 'Memnoc/tmux-drudwyn'];
const checkedAt = '2026-09-30T12:00:00.000Z';
let snapshotPath;
let responses;

beforeEach(async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'project-metadata-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  snapshotPath = join(directory, 'projects.json');
  await writeFile(snapshotPath, '{}\n');
  responses = new Map();
  for (const repository of repositories) {
    const url = `https://api.github.com/repos/${repository}`;
    responses.set(url, {
      full_name: repository,
      description: `Description for ${repository}`,
      pushed_at: '2026-09-29T09:00:00Z',
    });
    responses.set(`${url}/releases/latest`, {
      tag_name: 'v1.2.3',
      html_url: `https://github.com/${repository}/releases/tag/v1.2.3`,
      draft: false,
      prerelease: false,
    });
  }
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.ok(responses.has(url), `Unexpected request: ${url}`);
    const body = responses.get(url);
    if (body instanceof Error) throw body;
    if (body instanceof Response) return body.clone();
    return Response.json(body);
  });
});

test('refresh persists descriptions, releases, repository activity and observation times', async () => {
  const result = await refreshProjects({ snapshotPath, now: () => new Date(checkedAt) });
  assert.deepEqual(result, { updated: repositories, failed: [] });
  const saved = JSON.parse(await readFile(snapshotPath, 'utf8'));
  assert.deepEqual(saved['Memnoc/CodeAtlas'], {
    description: 'Description for Memnoc/CodeAtlas',
    pushedAt: '2026-09-29T09:00:00Z',
    release: {
      tag: 'v1.2.3',
      url: 'https://github.com/Memnoc/CodeAtlas/releases/tag/v1.2.3',
    },
    checkedAt,
  });
  assert.equal(saved['Memnoc/tmux-drudwyn'].checkedAt, checkedAt);
});

test('an unavailable repository preserves its previous snapshot while the other refreshes', async () => {
  await refreshProjects({ snapshotPath, now: () => new Date(checkedAt) });
  const previous = JSON.parse(await readFile(snapshotPath, 'utf8'));
  responses.set('https://api.github.com/repos/Memnoc/CodeAtlas', new Error('GitHub unavailable'));

  const result = await refreshProjects({
    snapshotPath,
    now: () => new Date('2026-10-01T12:00:00.000Z'),
  });
  assert.deepEqual(result.updated, ['Memnoc/tmux-drudwyn']);
  assert.deepEqual(result.failed, [{ repository: 'Memnoc/CodeAtlas', error: 'GitHub unavailable' }]);
  const saved = JSON.parse(await readFile(snapshotPath, 'utf8'));
  assert.deepEqual(saved['Memnoc/CodeAtlas'], previous['Memnoc/CodeAtlas']);
  assert.equal(saved['Memnoc/tmux-drudwyn'].checkedAt, '2026-10-01T12:00:00.000Z');
});

for (const status of [403, 429, 500]) {
  test(`HTTP ${status} on releases retains all prior values and freshness`, async () => {
    await refreshProjects({ snapshotPath, now: () => new Date(checkedAt) });
    const previous = await readFile(snapshotPath, 'utf8');
    for (const repository of repositories) {
      responses.set(`https://api.github.com/repos/${repository}/releases/latest`,
        Response.json({ message: 'API unavailable' }, { status }));
    }
    const result = await refreshProjects({ snapshotPath });
    assert.equal(result.failed.length, 2);
    assert.match(result.failed[0].error, new RegExp(`HTTP ${status}`));
    assert.equal(await readFile(snapshotPath, 'utf8'), previous);
  });
}

test('no full release and absent descriptions are valid saved results', async () => {
  for (const [index, repository] of repositories.entries()) {
    const url = `https://api.github.com/repos/${repository}`;
    responses.set(url, { full_name: repository, description: index ? '' : null, pushed_at: null });
    responses.set(`${url}/releases/latest`, Response.json({ message: 'Not Found' }, { status: 404 }));
  }
  const result = await refreshProjects({ snapshotPath, now: () => new Date(checkedAt) });
  assert.deepEqual(result.failed, []);
  assert.deepEqual(JSON.parse(await readFile(snapshotPath, 'utf8'))['Memnoc/CodeAtlas'], {
    description: null, pushedAt: null, release: null, checkedAt,
  });
});

for (const [label, endpoint, body] of [
  ['invalid JSON', '', new Response('not JSON')],
  ['missing fields', '', {}],
  ['wrong repository', '', { full_name: 'Other/Repository', description: null, pushed_at: null }],
  ['invalid description', '', { full_name: repositories[0], description: 42, pushed_at: null }],
  ['invalid date', '', { full_name: repositories[0], description: null, pushed_at: 'yesterday' }],
  ['impossible date', '', { full_name: repositories[0], description: null, pushed_at: '2026-02-30T00:00:00Z' }],
  ['release missing fields', '/releases/latest', {}],
  ['null release response', '/releases/latest', null],
  ['unsafe release URL', '/releases/latest', { tag_name: 'v1', html_url: 'javascript:alert(1)', draft: false, prerelease: false }],
  ['other repository release', '/releases/latest', { tag_name: 'v1', html_url: 'https://github.com/Other/Repo/releases/tag/v1', draft: false, prerelease: false }],
  ['unpublished release', '/releases/latest', { tag_name: 'v1', html_url: 'https://github.com/Memnoc/CodeAtlas/releases/tag/v1', draft: true, prerelease: false }],
]) {
  test(`${label} preserves previous successful values`, async () => {
    await refreshProjects({ snapshotPath, now: () => new Date(checkedAt) });
    const previous = JSON.parse(await readFile(snapshotPath, 'utf8'));
    responses.set(`https://api.github.com/repos/Memnoc/CodeAtlas${endpoint}`, body);
    const result = await refreshProjects({ snapshotPath });
    assert.equal(result.failed.length, 1);
    assert.deepEqual(JSON.parse(await readFile(snapshotPath, 'utf8'))['Memnoc/CodeAtlas'], previous['Memnoc/CodeAtlas']);
  });
}

test('manual command reports failure without altering an existing snapshot', async () => {
  await refreshProjects({ snapshotPath, now: () => new Date(checkedAt) });
  const previous = await readFile(snapshotPath, 'utf8');
  const preload = join(snapshotPath, '..', 'offline.mjs');
  await writeFile(preload, "globalThis.fetch = async () => { throw new Error('offline fixture'); };\n");
  const result = spawnSync(process.execPath,
    ['--import', preload, 'scripts/refresh-projects.mjs', snapshotPath], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Memnoc\/CodeAtlas: offline fixture/);
  assert.match(result.stderr, /Memnoc\/tmux-drudwyn: offline fixture/);
  assert.equal(await readFile(snapshotPath, 'utf8'), previous);
});

for (const contents of ['[]\n', 'null\n', '{"Memnoc/CodeAtlas":{"checkedAt":"tomorrow"}}\n']) {
  test(`invalid stored snapshot is rejected without replacement: ${contents.trim()}`, async () => {
    await writeFile(snapshotPath, contents);
    await assert.rejects(refreshProjects({ snapshotPath }), /Invalid saved snapshot/);
    assert.equal(await readFile(snapshotPath, 'utf8'), contents);
  });
}

test('a failed first refresh leaves unknown data absent, without a fabricated timestamp', async () => {
  responses.set('https://api.github.com/repos/Memnoc/CodeAtlas', new Error('offline'));
  await refreshProjects({ snapshotPath });
  const saved = JSON.parse(await readFile(snapshotPath, 'utf8'));
  assert.equal(saved['Memnoc/CodeAtlas'], undefined);
  assert.ok(saved['Memnoc/tmux-drudwyn'].checkedAt);
});
