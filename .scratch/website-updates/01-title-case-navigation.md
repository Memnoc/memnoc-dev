# 01 — Title-case navigation

**Spec:** `docs/specs/2026-09-30-website-updates.md`

**What to build:** Visitors see Home, About, and Writing with title-case labels
throughout the site, retaining existing navigation behavior.

**Blocked by:** None — can start immediately.

**Status:** ready

- [ ] Visible and accessible navigation labels are Home, About, and Writing.
- [ ] Destinations, active-page indicators, and conditional Writing visibility
      retain their behavior on the homepage, About, and writing routes.
- [ ] Existing browser expectations affected by changed capitalization are updated;
      verify navigation through the existing browser seam.
- [ ] Follow the repository's TDD and crosscheck workflow; record verification.
- [ ] Commit the completed ticket and implementation on this worker's branch.

## Parallel work agreement

Own navigation markup and its affected test expectations. Avoid article-header,
project-sync, and global styling changes. Coordinate with the blog worker if an
existing browser test needs edits from both tickets. Use development port 4322.
Reserve port 4321 with the coordinating session before browser verification.
Do not merge, push, or deploy; hand the committed branch back for integration.
