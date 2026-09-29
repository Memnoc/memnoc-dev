import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

assert.equal(readFileSync('source.txt', 'utf8').trim(), 'local source fixture');
if (process.argv.includes('--fail')) {
  console.error('fixture build failed');
  process.exitCode = 1;
}
