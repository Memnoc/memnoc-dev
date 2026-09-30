import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import shared from '../../playwright.config';

export default defineConfig({
  ...shared,
  testDir: '.',
  reporter: [['list'], ['html', {
    open: 'never',
    outputFolder: fileURLToPath(new URL('./playwright-report/', import.meta.url)),
  }]],
  webServer: {
    ...shared.webServer,
    cwd: fileURLToPath(new URL('../../', import.meta.url)),
    command: 'node tests/article-headers/preview.mjs',
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 },
  },
});
