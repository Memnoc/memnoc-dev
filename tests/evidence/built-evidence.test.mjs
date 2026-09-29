import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test, { beforeEach } from 'node:test';

import {
  BUILT_CANDIDATES,
  verifyBuiltEvidence,
} from '../../scripts/verify-built-evidence.mjs';

const commit = '0123456789abcdef0123456789abcdef01234567';
const repositoryUrl = 'https://github.com/Memnoc/CodeAtlas';
const rawUrl = `https://raw.githubusercontent.com/Memnoc/CodeAtlas/${commit}`;
const workflowUrl = `${repositoryUrl}/actions/workflows/ci.yml?query=branch%3Amain`;
let responses;

beforeEach((t) => {
  responses = new Map([
    [repositoryUrl, JSON.stringify({ defaultBranch: 'main', currentOid: commit, isFork: false })],
    [`${rawUrl}/Cargo.toml`, '[package]\nname = "fixture"'],
    [`${rawUrl}/crates/codeatlas/src/main.rs`, 'fn main() {}'],
    [`${rawUrl}/dashboard/src/main.tsx`, 'export {};'],
    [workflowUrl, `<a aria-label="completed successfully: CI" href="/Memnoc/CodeAtlas/commit/${commit}">CI</a>`],
    [`${rawUrl}/README.md`, `## Install
cargo build --release
codeatlas scan
## Thanks
This fixture is strongly inspired by prior work.
Its execution was shaped throughout by studying prior work.`],
    [`${rawUrl}/LICENSE`, 'MIT License\nMatteo Stara'],
    [`${rawUrl}/docs/SECURITY.md`, '## Honest limitations\nFixture limitations.'],
  ]);
  t.mock.method(globalThis, 'fetch', async (url) => {
    if (!responses.has(url)) {
      throw new Error(`No fixture for ${url}; live network access is disabled`);
    }
    const body = responses.get(url);
    return body === null
      ? new Response(null, { status: 404, statusText: 'Not Found' })
      : new Response(body);
  });
});

test('reports every required Built-entry proof from controlled GitHub responses', async () => {
  const reports = await verifyBuiltEvidence([BUILT_CANDIDATES[0]]);

  assert.deepEqual(
    reports.map(({ name, defaultBranch, evidence }) => ({
      name,
      defaultBranch,
      evidence,
    })),
    [
      {
        name: 'CodeAtlas',
        defaultBranch: 'main',
        evidence: [
          'working source',
          'clean build',
          'runnable instructions',
          'license',
          'known limitations',
          'original-work account',
        ],
      },
    ],
  );
});

test('an unavailable public repository names the candidate and HTTP failure', async () => {
  const unavailable = {
    ...BUILT_CANDIDATES[0],
    repository: 'Memnoc/portfolio-evidence-check-no-such-repository',
  };
  responses.set('https://github.com/Memnoc/portfolio-evidence-check-no-such-repository', null);

  await assert.rejects(
    verifyBuiltEvidence([unavailable]),
    {
      name: 'EvidenceVerificationError',
      message:
        'CodeAtlas (Memnoc/portfolio-evidence-check-no-such-repository): public repository is unavailable (HTTP 404 Not Found)',
    },
  );
});

test('an unexpected default branch reports the expected and public names', async () => {
  const unexpectedDefault = {
    ...BUILT_CANDIDATES[0],
    expectedDefaultBranch: 'portfolio-evidence-check-no-such-branch',
  };

  await assert.rejects(
    verifyBuiltEvidence([unexpectedDefault]),
    {
      name: 'EvidenceVerificationError',
      message:
        'CodeAtlas (Memnoc/CodeAtlas): default branch is "main", expected "portfolio-evidence-check-no-such-branch"',
    },
  );
});

test('a missing required evidence document reports its branch path and purpose', async () => {
  const missingDocument = {
    ...BUILT_CANDIDATES[0],
    evidenceDocuments: [
      {
        label: 'known limitations',
        path: 'docs/portfolio-evidence-check-no-such-document.md',
        patterns: [/not reached/],
      },
    ],
  };
  responses.set(`${rawUrl}/docs/portfolio-evidence-check-no-such-document.md`, null);

  await assert.rejects(
    verifyBuiltEvidence([missingDocument]),
    {
      name: 'EvidenceVerificationError',
      message:
        'CodeAtlas (Memnoc/CodeAtlas): known limitations document docs/portfolio-evidence-check-no-such-document.md is unavailable (HTTP 404 Not Found)',
    },
  );
});

test('a missing successful clean-build check reports the public revision and check', async () => {
  const missingBuild = {
    ...BUILT_CANDIDATES[0],
    cleanBuild: {
      type: 'github-workflow',
      workflow: 'portfolio-evidence-check-no-such-build.yml',
    },
  };
  responses.set(`${repositoryUrl}/actions/workflows/portfolio-evidence-check-no-such-build.yml?query=branch%3Amain`, '<p>No workflow runs.</p>');

  await assert.rejects(
    verifyBuiltEvidence([missingBuild]),
    (error) => {
      assert.equal(error.name, 'EvidenceVerificationError');
      assert.match(
        error.message,
        /^CodeAtlas \(Memnoc\/CodeAtlas\): clean build is not successful at [0-9a-f]{8}: workflow portfolio-evidence-check-no-such-build\.yml$/,
      );
      return true;
    },
  );
});

test('rejects a successful build for a different revision', async () => {
  responses.set(workflowUrl, '<a aria-label="completed successfully: CI" href="/Memnoc/CodeAtlas/commit/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa">CI</a>');

  await assert.rejects(verifyBuiltEvidence([BUILT_CANDIDATES[0]]), {
    name: 'EvidenceVerificationError',
    message: 'CodeAtlas (Memnoc/CodeAtlas): clean build is not successful at 01234567: workflow ci.yml',
  });
});

test('rejects reachable documents that lack the required evidence', async () => {
  responses.set(`${rawUrl}/docs/SECURITY.md`, '# Security\nNo limitations statement.');

  await assert.rejects(verifyBuiltEvidence([BUILT_CANDIDATES[0]]), {
    name: 'EvidenceVerificationError',
    message: 'CodeAtlas (Memnoc/CodeAtlas): known limitations document docs/SECURITY.md does not contain the agreed evidence',
  });
});

function repositoryCommandCandidate(command) {
  // Exercise real extraction and subprocess execution with a local archive.
  const fixtures = fileURLToPath(new URL('./fixtures', import.meta.url));
  const archive = execFileSync('tar', ['-czf', '-', '-C', fixtures, 'repository']);
  responses.set(`https://codeload.github.com/Memnoc/CodeAtlas/tar.gz/${commit}`, archive);
  return {
    ...BUILT_CANDIDATES[0],
    cleanBuild: { type: 'repository-commands', commands: [command] },
  };
}

test('runs repository build commands inside the extracted source archive', async () => {
  const candidate = repositoryCommandCandidate([process.execPath, 'check.mjs']);
  const [report] = await verifyBuiltEvidence([candidate]);

  assert.equal(report.commit, commit);
  assert.ok(report.evidence.includes('clean build'));
});

test('reports a failed repository build command and its diagnostic', async () => {
  const candidate = repositoryCommandCandidate([process.execPath, 'check.mjs', '--fail']);

  await assert.rejects(verifyBuiltEvidence([candidate]), (error) => {
    assert.equal(error.name, 'EvidenceVerificationError');
    assert.match(error.message, /clean build command failed at 01234567:/);
    assert.match(error.message, /fixture build failed/);
    return true;
  });
});
