// @ts-check
import { defineConfig } from 'astro/config';
import { execSync } from 'child_process';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

let gitHash = 'unknown';
try {
  gitHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch {}

export default defineConfig({
  integrations: [react(), mdx()],
  vite: {
    define: {
      __GIT_HASH__: JSON.stringify(gitHash),
    },
  },
});