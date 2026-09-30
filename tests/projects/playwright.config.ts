import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import shared from '../../playwright.config';

export default defineConfig({
  ...shared,
  testDir: '.',
  testMatch: 'rendering.spec.ts',
  reporter: [['list']],
  webServer: {
    ...shared.webServer,
    cwd: fileURLToPath(new URL('../../', import.meta.url)),
    command: 'node tests/projects/preview.mjs',
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 },
  },
});
