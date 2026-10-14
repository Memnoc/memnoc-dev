## Problem Statement

Lesson 2 introduces implementation limits but readers need a practical way to inspect them. The author wants an identifiable Bonus section containing the header-inspection example.

## Solution

Offer an always-visible Bonus banner for optional exploration, using the existing article shape and Rose Pine palette. Place the header-reading commands, complete C example, compile command, and verified example output in Lesson 2.

## User Stories

1. As an author, I can write a BONUS Markdown callout with an optional title and ordinary rich content, including code and links.
2. As a reader, I recognize optional material through a Bonus text label and a compass icon, without redundant screen-reader announcements.
3. As a Lesson 2 reader, I can inspect the headers or compile a small program to display my implementation's limits.
4. As a reader, I can use Bonus material in all themes and on narrow screens, with code scrolling inside its banner.

## Implementation Decisions

- Extend the existing build-time article banner renderer with BONUS rather than adding another rendering system.
- Use iris text/border/tint and a decorative compass, which signals optional exploration.
- Keep the banner visible and preserve native Markdown formatting. Document the authoring syntax.
- Insert Lesson 2's Bonus after its type takeaways. Label numeric output as one verified GCC example, because other targets can differ.
- Full-page checks exposed faint default syntax comments and skipped Lesson 2 heading levels. Use the existing highlighter's CSS-variable theme with readable Rose Pine text tokens, and make Lesson 2 section headings follow its opening second-level heading without skipping a level.
- Apply the same Bonus component to the AoC introduction, move its original disclaimer into the existing bottom banner, and collect its references in compact Sources. Preserve the author's prose and correct webpage links accidentally marked as images.
- Replace the AoC cover with the supplied, prepared brain-gym banner and delete the previous image. Update image fixtures to the replacement's dimensions.
- Keep compiler flags intact in tables, add consistent cell spacing and row rules, and allow description cells to wrap without overflowing narrow screens.

## Testing Decisions

- Use the existing isolated article browser seam for semantic region, rich content, links, and icon accessibility.
- Include Bonus material in the existing all-theme and viewport fixture checks.
- Compile the complete Lesson 2 example, verify its shown output, and inspect the actual local article.

## Out of Scope

- Publishing during implementation; the initial request was local verification. The author subsequently approved committing and pushing the full update on 2026-10-14.
- Altering C_course source files or unrelated author edits.

## Verification

Verified locally on 2026-10-14.

| Story | Verdict | Evidence |
| --- | --- | --- |
| 1 - Authoring | pass | Isolated production browser checks preserve Bonus code, emphasis, and links. README includes the marker syntax. |
| 2 - Recognition and accessibility | pass | The labelled region stays visible; its compass is decorative and nonfocusable. Desktop and mobile screenshots were inspected. |
| 3 - Lesson 2 example | pass | The actual lesson contains the complete inspection program and compile commands. All complete article programs compile with strict GCC warnings, and all four displayed tables match execution. |
| 4 - Themes and layout | pass | All three themes pass narrow/wide Axe and overflow checks. Faint syntax comments and skipped heading levels found during verification were corrected. The refreshed local development page also passes Axe in every theme. |

Typechecking and production build pass. All 64 article/site browser checks pass: 21 article checks and 43 site checks, including the subsequent Clarification addition. The image audit has no errors and one pre-existing advisory for the unrelated how-to-study source image. Desktop and mobile table screenshots and the updated AoC page were inspected. Independent specification and standards reviews found no actionable issues. The author approved committing and pushing the complete website update on 2026-10-14.

The final repository-wide publication review caught two returns outside `main` in the author-edited Lesson 2 examples. Both were moved inside their functions. All five complete programs across Lessons 1 and 2 then compiled and ran with strict C17 warnings on GCC and Clang, and all four Lesson 2 output blocks matched execution. The separate project browser check also passed with GitHub unavailable, preserving deployment independence.
