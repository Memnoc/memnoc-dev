# 02 — Colored article header and author-written TL;DR

**Spec:** `docs/specs/2026-09-30-website-updates.md`

**What to build:** Readers see a more inviting article header with a readable,
author-controlled TL;DR where supplied, styled consistently across Rosé Pine,
Moon, and Dawn.

**Blocked by:** None — can start immediately.

**Status:** ready

- [ ] Article headers visually group the title, date, tags, and optional TL;DR
      using existing theme colors and preserving semantic heading structure.
- [ ] Authors can supply optional TL;DR content through content metadata.
- [ ] Demonstrate the panel on existing published writing using appropriate
      existing author-written summary copy; no build-time generated summaries.
- [ ] Posts lacking a TL;DR remain valid and render without an empty panel.
- [ ] Headers remain readable and accessible in all three themes and at mobile
      widths; article content, tag links, and draft filtering remain intact.
- [ ] Follow TDD and crosscheck, including focused production-browser coverage
      for the summary-present and summary-absent behaviors; record verification.
- [ ] Commit the completed ticket and implementation on this worker's branch.

## Parallel work agreement

Own article presentation, optional summary metadata, and focused article tests.
Prefer scoped article styles and a separate focused test file to reduce overlap.
Avoid navigation and homepage project changes. Leave the maintainer's tutorial
notes alone. Use development port 4323. Reserve port 4321 with the coordinating
session before browser verification. Do not merge, push, or deploy; hand the
committed branch back for integration.
