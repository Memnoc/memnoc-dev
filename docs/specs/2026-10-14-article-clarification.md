## Problem Statement

The floating-point precision note in Lesson 2 needs to stand out as a clarification while keeping the author's wording and its place in the explanation.

## Solution

Show the note in an always-visible Clarification banner, matching the existing article banners with a distinct Rose Pine pine accent and an information icon.

## User Stories

1. As an author, I can mark an inline clarification with an optional title using ordinary Markdown callout syntax.
2. As a reader, I see the unchanged floating-point note between the output example and the explanation of formatting improvements.
3. As a reader, I can read the clarification on mobile and desktop in all three themes, with a text label and a decorative information icon.

## Implementation Decisions

- Extend the existing article banner renderer with a CLARIFICATION marker; preserve its rich Markdown handling and accessible region naming.
- Use the shared rounded shape, pine accent, readable label color, and the existing information artwork. Keep the banner visible.
- Wrap the existing Lesson 2 paragraph in the callout, titled Floating-point precision. Preserve its wording and surrounding paragraphs.
- Document the reusable authoring syntax. No content schema changes are needed.

## Testing Decisions

- Continue using the established isolated production article browser seam. Observe the real rendered lesson, unchanged note, surrounding prose, and decorative icon.
- Check all three themes at narrow and wide widths through the existing article accessibility and overflow checks.

## Out of Scope

- Further fact-checking or rewriting the article; this change only presents the existing note.
- Publishing during implementation; the initial workflow was local review. After verification, the author approved committing and pushing the full website update on 2026-10-14.

## Verification

Verified locally on 2026-10-14.

| Story | Verdict | Evidence |
| --- | --- | --- |
| 1 - Authoring | pass | The actual lesson's titled Markdown callout renders through the existing banner pipeline; README documents the marker and optional title. |
| 2 - Lesson placement | pass | Browser assertions confirm the exact original paragraph and its position between the numeric output and formatting explanation. |
| 3 - Readability | pass | All three themes pass the existing mobile/desktop accessibility and overflow checks; the icon is decorative and nonfocusable. Local desktop and mobile screenshots were inspected. |

Typecheck and production build pass. All 64 article/site browser checks pass: 21 article checks and 43 site checks. Independent standards and specification reviews found no actionable issues. Astro's generated content cache was refreshed so the local development page renders the updated callout. The author subsequently approved committing and pushing the complete website update on 2026-10-14.
