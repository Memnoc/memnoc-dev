# 03 — Persist and display synced CodeAtlas and Drudwyn metadata

**Spec:** `docs/specs/2026-09-30-website-updates.md`

**What to build:** Visitors see CodeAtlas and Drudwyn on the homepage with saved
GitHub descriptions, latest available releases, and last-update information.
Periodic refreshes can update this data without making website deployment depend
on GitHub availability or either project's build outcome.

**Blocked by:** None — can start immediately.

**Status:** ready

- [ ] Show CodeAtlas once and add Drudwyn with correct source links; retain
      Northstar and StarScript and their existing provenance/maturity distinctions.
- [ ] Show saved descriptions, latest release links where available, and clearly
      identified last-update information, with honest missing-data fallbacks.
- [ ] Include a usable initial persisted snapshot. Static builds read saved data
      without network requests for project metadata or linked-project builds.
- [ ] Provide daily scheduled and manual refresh entry points. Validated changes
      are persisted through an update pull request for later website deployment.
- [ ] Failed refreshes retain previous successful values and freshness timestamps;
      one failing repository does not discard the other's successful refresh.
- [ ] Handle no published release as a valid result; validate and safely handle
      missing descriptions, malformed responses, network errors, and rate limits.
- [ ] A linked project's failing CI never blocks the website build or deployment.
      Keep live audit failures visible separately and retain local website checks.
- [ ] Use controlled external responses and temporary snapshot storage to verify
      persistence and failure behavior; routine tests do not need live GitHub.
- [ ] Verify visible project data through production-browser coverage and verify
      builds with external metadata unavailable and linked-project CI failing.
- [ ] Follow TDD and crosscheck; document workflow setup requirements and results.
- [ ] Commit the completed ticket and implementation on this worker's branch.

## Parallel work agreement

Own project data, homepage project rendering, refresh automation, and associated
tests. Keep project styles scoped; avoid navigation and article presentation.
Consult current official GitHub documentation for API and automation details.
Use development port 4324. Reserve port 4321 with the coordinating session before
browser verification. Implement workflow files locally; do not change remote
settings, merge, push, or deploy. Hand the committed branch back for integration.
