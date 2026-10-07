## Problem Statement

The article header is visually heavy compared with the disclaimer. Course authors also need recognizable exercise assignments and answers that readers can reveal when ready.

## Solution

Use a compact family of Rosé Pine banners with subtle backgrounds, rounded corners, and left accent borders. Keep exercises visible and solutions collapsed initially, as confirmed by the author on 2026-10-07.

## User Stories

1. As a reader, I can scan the title, date, tags, and optional TL;DR in a compact header without a nested panel.
2. As an author, I can write exercise and solution banners in existing Markdown posts, including optional titles, paragraphs, lists, links, and fenced code.
3. As a reader, I see assignments immediately and can reveal and hide each solution independently using the keyboard or pointer, without JavaScript.
4. As a reader, I can use the banners in Dawn, Moon, and Rosé Pine on narrow and wide screens, with readable text and visible keyboard focus.
5. As an author, my ordinary blockquotes and unrecognized callout markers keep their existing rendering, and the README explains the new syntax.

## Implementation Decisions

- Share the disclaimer's padding, subtle tint, rounded corners, and left accent border across article banners. Use iris for the header, foam for exercises, rose for solutions, and retain gold for disclaimers.
- Keep article metadata and optional TL;DR semantics; remove the summary's nested background and padding.
- Recognize blockquotes beginning with an EXERCISE or SOLUTION marker in square brackets prefixed by an exclamation mark. An optional plain-text title follows the marker on the same line. Authors separate body content from that line with a quoted blank line.
- Transform Markdown at build time using the existing processing pipeline. Exercise banners are labeled sections; solutions use native details and summary elements without the open attribute. Reuse the site's existing theme tokens.
- Make fenced code scroll within the banner rather than widening the page. Preserve normal Markdown content and image processing inside banners.

## Testing Decisions

- Use the existing isolated article build and browser seam to exercise author-written Markdown through rendered HTML. No internal mocks.
- Verify default-hidden answers, independent keyboard and pointer toggles, formatted content, unrecognized markers, and ordinary blockquotes.
- Extend theme, viewport, and accessibility coverage to expanded solutions. Visually inspect the compact header and banners.
- Run typechecking, the production build, and the existing full verification suites after focused checks.

## Out of Scope

- Writing exercise assignments or answers for the author's lessons: this change provides presentation and authoring support.
- Publishing or pushing the changes: not requested.
- Changing existing article prose or frontmatter: unnecessary for reusable banners.

## Verification

Verified locally on 2026-10-07 against production builds, including an isolated fixture build.

| Story | Verdict | Evidence |
| --- | --- | --- |
| 1 — Compact header | pass | Existing header metadata tests pass; visual inspection of lesson 1 and the fixture confirms a single background and left border. |
| 2 — Markdown authoring | pass | Built fixtures preserve paragraphs, emphasized text, lists, links, fenced code, and an optimized image inside a solution. |
| 3 — Answer disclosure | pass | Browser test with JavaScript disabled verifies initially hidden answers, independent pointer and Enter/Space toggles, and visible keyboard focus. |
| 4 — Themes and viewports | pass | Expanded solutions pass Axe and overflow checks in Dawn, Moon, and Rosé Pine at 320px and 1280px; screenshots inspected in light/dark and mobile layouts. |
| 5 — Compatibility and docs | pass | Ordinary quotes, unknown markers, and literal code examples remain intact; README includes copyable authoring examples. |

Typecheck and production build passed. Full verification passed: 43 production browser tests, 12 article browser tests, 1 project fallback browser test, and 39 offline tests (9 evidence, 22 project metadata, 8 image tests). The article suite passed again after adding image-inside-solution coverage. Image audit reports zero errors; its five existing advisory warnings concern external image URLs and the oversized study-diagram source.

### Standards review

Independent review found no actionable standards violations or material maintainability/accessibility defects.

### Spec review

Independent review found no confirmed spec violations or scope creep. It identified missing verification of images inside banners; added an optimized-image fixture and browser assertions, then reran the article suite successfully. No unresolved findings remain on either axis.

The article fixture harness now runs Astro from its temporary root so generated build assets remain isolated and do not require cross-filesystem renames. Test fixtures remain outside the deployable content directory. No article prose or frontmatter was changed.
