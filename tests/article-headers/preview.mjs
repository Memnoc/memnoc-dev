import { spawn } from 'node:child_process';
import { cp, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

// Build fixtures in an isolated copy so they can never enter the deployable dist.
const root = await mkdtemp(join(tmpdir(), 'article-headers-'));
const astro = resolve('node_modules/astro/bin/astro.mjs');
let child;
let stopping = false;

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    stopping = true;
    child?.kill(signal);
  });
}

function run(args) {
  if (stopping) return Promise.resolve();
  return new Promise((resolve, reject) => {
    child = spawn(process.execPath, [astro, ...args, '--root', root], { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === 0 || signal === 'SIGTERM' || signal === 'SIGINT') resolve();
      else reject(new Error(`Astro ${args[0]} exited with ${code ?? signal}`));
    });
  });
}

try {
  for (const path of ['src', 'public', 'astro.config.mjs', 'package.json', 'tsconfig.json']) {
    await cp(path, join(root, path), { recursive: true });
  }
  await symlink(resolve('node_modules'), join(root, 'node_modules'), 'dir');
  await writeFile(join(root, 'src/content/blog/without-summary.md'), `---
title: "An article without a summary"
date: 2026-09-29
description: "A description is not an implicit TL;DR."
tags: [legacy]
---

This older article still has its original body.

![First local image](../../assets/blog/brain-gym/cover.jpg)

![Later local image][photo]

[photo]: ../../assets/blog/brain-gym/cover.jpg
`);
  await run(['build']);
  await run(['preview', '--host', '127.0.0.1', '--port', process.env.PREVIEW_PORT ?? '4321']);
} finally {
  await rm(root, { recursive: true, force: true });
}
