import { readFile, rename, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositories = ['Memnoc/CodeAtlas', 'Memnoc/tmux-drudwyn'];

async function github(path, { allowMissing = false } = {}) {
  const response = await fetch(`https://api.github.com/repos/${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2026-03-10',
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
    signal: AbortSignal.timeout(15_000),
  });
  if (allowMissing && response.status === 404) return null;
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  const body = await response.json();
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error(`${path}: invalid JSON object`);
  }
  return body;
}

function validTimestamp(value) {
  return typeof value === 'string'
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(value)
    && Number.isFinite(Date.parse(value))
    && new Date(value).toISOString() === (value.includes('.') ? value : value.replace('Z', '.000Z'));
}

function validateProject(project, release, repository) {
  if (project.full_name !== repository
    || !(project.description === null || typeof project.description === 'string')
    || !(project.pushed_at === null || validTimestamp(project.pushed_at))) {
    throw new Error('Invalid repository metadata');
  }
  if (release !== null && (
    typeof release.tag_name !== 'string' || !release.tag_name.trim()
    || typeof release.html_url !== 'string'
    || !release.html_url.startsWith(`https://github.com/${repository}/releases/tag/`)
    || release.html_url.length <= `https://github.com/${repository}/releases/tag/`.length
    || release.draft !== false || release.prerelease !== false
  )) {
    throw new Error('Invalid published release metadata');
  }
}

export async function refreshProjects({
  snapshotPath = fileURLToPath(new URL('../src/data/projects.json', import.meta.url)),
  now = () => new Date(),
} = {}) {
  const snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'));
  try {
    if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) throw new Error('Expected an object');
    for (const [repository, saved] of Object.entries(snapshot)) {
      if (!repositories.includes(repository) || !validTimestamp(saved.checkedAt)) throw new Error('Invalid observation');
      validateProject({ full_name: repository, description: saved.description, pushed_at: saved.pushedAt },
        saved.release === null ? null : {
          tag_name: saved.release.tag, html_url: saved.release.url, draft: false, prerelease: false,
        }, repository);
    }
  } catch (error) {
    throw new Error(`Invalid saved snapshot: ${error.message}`);
  }
  const updated = [];
  const failed = [];
  for (const repository of repositories) {
    try {
      const project = await github(repository);
      const release = await github(`${repository}/releases/latest`, { allowMissing: true });
      validateProject(project, release, repository);
      snapshot[repository] = {
        description: project.description?.trim() || null,
        pushedAt: project.pushed_at,
        release: release ? { tag: release.tag_name, url: release.html_url } : null,
        checkedAt: now().toISOString(),
      };
      updated.push(repository);
    } catch (error) {
      failed.push({ repository, error: error.message });
    }
  }
  if (updated.length) {
    await writeFile(`${snapshotPath}.tmp`, `${JSON.stringify(snapshot, null, 2)}\n`);
    await rename(`${snapshotPath}.tmp`, snapshotPath);
  }
  return { updated, failed };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await refreshProjects({ snapshotPath: process.argv[2] });
    for (const repository of result.updated) console.log(`Saved ${repository}`);
    for (const { repository, error } of result.failed) console.error(`${repository}: ${error}`);
    if (result.failed.length) process.exitCode = 1;
  } catch (error) {
    console.error(`Project refresh: ${error.message}`);
    process.exitCode = 1;
  }
}
