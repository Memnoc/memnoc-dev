import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { cp, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

// Isolated production build: fixture snapshots never enter the deployable dist.
const root = await mkdtemp(join(tmpdir(), 'saved-projects-'));
const astro = resolve('node_modules/astro/bin/astro.mjs');
const preload = resolve('tests/projects/offline-github.mjs');
const requestLog = join(root, 'requests.log');
let child;
let stopping = false;

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    stopping = true;
    child?.kill(signal);
  });
}

function run(args, expectedCode = 0, command = process.execPath) {
  if (stopping) return Promise.resolve('');
  return new Promise((resolve, reject) => {
    let output = '';
    const commandArgs = command === process.execPath ? ['--import', preload, ...args] : args;
    child = spawn(command, commandArgs, {
      env: { ...process.env, PROJECT_REQUEST_LOG: requestLog, ASTRO_TELEMETRY_DISABLED: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    for (const stream of [child.stdout, child.stderr]) stream.on('data', chunk => {
      output += chunk;
      process.stdout.write(chunk);
    });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === expectedCode || signal === 'SIGTERM' || signal === 'SIGINT') resolve(output);
      else reject(new Error(`Fixture command exited with ${code ?? signal}: ${output}`));
    });
  });
}

try {
  for (const path of ['src', 'public', 'tests', 'playwright.config.ts', 'astro.config.mjs', 'package.json', 'tsconfig.json']) {
    await cp(path, join(root, path), { recursive: true });
  }
  await symlink(resolve('node_modules'), join(root, 'node_modules'), 'dir');
  await writeFile(join(root, 'src/data/projects.json'), JSON.stringify({
    'Memnoc/CodeAtlas': {
      description: null, pushedAt: null, release: null, checkedAt: '2026-09-01T12:00:00.000Z',
    },
  }));

  const audit = await run(['scripts/verify-built-evidence.mjs'], 1);
  assert.match(audit, /clean build is not successful/);
  await writeFile(requestLog, '');
  await run([astro, 'build', '--root', root]);
  // A valid sparse snapshot must also keep the normal browser assertions type-safe.
  await run(['--noEmit', '--project', join(root, 'tsconfig.json')], 0, 'tsc');
  assert.equal(await readFile(requestLog, 'utf8'), '', 'Static build must not request project metadata or CI');
  await run([astro, 'preview', '--root', root, '--host', '127.0.0.1', '--port', '4321']);
} finally {
  await rm(root, { recursive: true, force: true });
}
