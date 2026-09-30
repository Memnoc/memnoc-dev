# 03 — Persist and display synced CodeAtlas and Drudwyn metadata

**Spec:** `docs/specs/2026-09-30-website-updates.md`

**What to build:** Visitors see CodeAtlas and Drudwyn on the homepage with saved
GitHub descriptions, latest available releases, and last-update information.
Periodic refreshes can update this data without making website deployment depend
on GitHub availability or either project's build outcome.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] Show CodeAtlas once and add Drudwyn with correct source links; retain
      Northstar and StarScript and their existing provenance/maturity distinctions.
- [x] Show saved descriptions, latest release links where available, and clearly
      identified last-update information, with honest missing-data fallbacks.
- [x] Include a usable initial persisted snapshot. Static builds read saved data
      without network requests for project metadata or linked-project builds.
- [x] Provide daily scheduled and manual refresh entry points. Validated changes
      are persisted through an update pull request for later website deployment.
- [x] Failed refreshes retain previous successful values and freshness timestamps;
      one failing repository does not discard the other's successful refresh.
- [x] Handle no published release as a valid result; validate and safely handle
      missing descriptions, malformed responses, network errors, and rate limits.
- [x] A linked project's failing CI never blocks the website build or deployment.
      Keep live audit failures visible separately and retain local website checks.
- [x] Use controlled external responses and temporary snapshot storage to verify
      persistence and failure behavior; routine tests do not need live GitHub.
- [x] Verify visible project data through production-browser coverage and verify
      builds with external metadata unavailable and linked-project CI failing.
- [x] Follow TDD and crosscheck; document workflow setup requirements and results.
- [x] Commit the completed ticket and implementation on this worker's branch.

## Parallel work agreement

Own project data, homepage project rendering, refresh automation, and associated
tests. Keep project styles scoped; avoid navigation and article presentation.
Consult current official GitHub documentation for API and automation details.
Use development port 4324. Reserve port 4321 with the coordinating session before
browser verification. Implement workflow files locally; do not change remote
settings, merge, push, or deploy. Hand the committed branch back for integration.


## Implementation and verification

Implemented against planning commit `1d533a4158ff264f15ad43f2a92be35d39f64468`.
The initial snapshot was fetched through the validated refresh command on
2026-09-30. CodeAtlas reported v0.1.8; Drudwyn reported no published full release.
`README.md` documents API semantics, daily/manual maintenance, required Actions
permissions, PR review/check approval, and the independent deployment path.
No remote settings, pull requests, pushes, merges, or deployments were performed.

TDD observed failures before persistence, per-repository retention, HTTP error
handling, missing-data results, validation, CLI behavior, and visible metadata
were implemented. All final checks pass:

- `pnpm typecheck` and `pnpm build`.
- `pnpm test:evidence`: 9 offline tests.
- `pnpm test:projects`: 22 controlled-response and temporary-storage tests.
- `pnpm test:browser`: 40 production browser/accessibility tests, including
  project links, provenance, freshness, all three themes, and 320px layout.
- `pnpm test:projects:browser`: 1 isolated production-browser fallback test.
  Its setup proves the independent audit rejects a simulated CI failure, then
  builds with unavailable metadata and zero external fetch requests. It also
  typechecks the source and normal browser tests against a sparse snapshot.
- Workflow YAML syntax and dependencies inspected: scheduled/manual refresh and
  live evidence audit remain outside ordinary Verify and Cloudflare deployment.
- `git diff --check`.

Port 4321 was reserved with the coordinating session before browser verification;
all runs were sequential. Remote workflow execution remains an integration/setup
check because the parallel agreement allows local workflow implementation only.

## Standards

Independent review found one P2: browser assertions relied on the initial JSON's
populated shape. Resolved with an explicit nullable metadata contract and
missing-value assertions. Follow-up review reports no remaining standards
violations or actionable baseline smells.

## Spec

Independent review found the same P2: valid null metadata could fail required
website verification. Fixed and regression-checked with an isolated sparse
snapshot. No other missing requirements, scope creep, or incorrect behavior found.

Crosscheck: Standards 0 remaining; Spec 0 remaining.

## Integration handoff

Cherry-pick this worker's completed commit onto the coordinating branch. Preserve
ticket 02's expanded `test:browser` command when integrating `package.json`;
ticket 03 only adds `test:projects`, `test:projects:browser`, and `refresh:projects`.
The Verify workflow runs the extra project browser suite sequentially after the
normal browser command. Run assembled-system hardening after all tickets merge.
