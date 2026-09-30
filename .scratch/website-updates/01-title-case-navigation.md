# 01 — Title-case navigation

**Spec:** `docs/specs/2026-09-30-website-updates.md`

**What to build:** Visitors see Home, About, and Writing with title-case labels
throughout the site, retaining existing navigation behavior.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] Visible and accessible navigation labels are Home, About, and Writing.
- [x] Destinations, active-page indicators, and conditional Writing visibility
      retain their behavior on the homepage, About, and writing routes.
- [x] Existing browser expectations affected by changed capitalization are updated;
      verify navigation through the existing browser seam.
- [x] Follow the repository's TDD and crosscheck workflow; record verification.
- [x] Commit the completed ticket and implementation on this worker's branch.

## Parallel work agreement

Own navigation markup and its affected test expectations. Avoid article-header,
project-sync, and global styling changes. Coordinate with the blog worker if an
existing browser test needs edits from both tickets. Use development port 4322.
Reserve port 4321 with the coordinating session before browser verification.
Do not merge, push, or deploy; hand the committed branch back for integration.

## Verification

- Port 4321 reserved with the user for this worker's browser verification.
- TDD: `pnpm test:browser navigation.spec.ts` failed on the missing exact
  accessible name `Home` before implementation, then passed after the three
  navigation labels were capitalized.
- Browser coverage checks visible text, exact accessible names, destinations,
  active classes, and `aria-current` on Home, About, the writing index, an
  article, and a tag page, then follows all three navigation links.
- Conditional Writing visibility still uses the existing published-writing
  guard; the implementation diff changes only the three link text literals.
- `pnpm typecheck`, `pnpm build`, and `git diff --check` passed.
- `pnpm test:evidence`: 9 passed. `pnpm test:browser`: all 37 passed, including
  accessibility, theme, keyboard, and mobile layout checks.
- Crosscheck: independent Standards review found 0 issues; independent Spec
  review found 0 issues. Both reviewed the staged diff against planning commit
  `1d533a4158ff264f15ad43f2a92be35d39f64468`.
- Browser verification is complete and port 4321 is released.
- Completed ticket and implementation are committed together on this worker
  branch for integration. No merge, push, or deployment was performed.
