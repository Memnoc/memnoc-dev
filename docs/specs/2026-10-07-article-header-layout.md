## Problem Statement

The article opening feels crowded with metadata, summary, navigation, and banners grouped at the top.

## Solution

Place lesson navigation first and the source-code banner directly below it, then present the summary as introductory text under the title and move the disclaimer to the bottom. Preserve the Rose Pine text colors, tag pills, and highlighted course navigation requested by the author.

## User Stories

1. As a reader, I see the optional summary directly beneath the title, followed by compact metadata, without an enclosing tinted header box.
2. As a reader, I find the optional disclaimer after the article content, including sources, with its existing gold banner and icon.
3. As a reader, I see lesson buttons first within the article and the source-code banner directly below them, followed by the title; I retain the colored title, tag pills, and highlighted current lesson in every theme and screen size.
4. As a reader, I can recognize article sections through differently colored heading levels, a slim accent line, and a subtle fading tint, with different sizes preserving the hierarchy; bold text also has a distinct accent.
5. As a reader of the C-course Intro or Lesson 1, I see the course image after the article information and before the first section heading.

## Implementation Decisions

- Remove the outer header banner styling. Keep the summary's accessible TL;DR label while displaying its text as an ordinary introduction.
- Let date and tag pills share a wrapping row. Preserve the existing color tokens and navigation component.
- Move course navigation before the source-code banner and article header. Remove its former top divider and use spacing below the navigation instead.
- Render the disclaimer after the article body, with spacing above it.
- Style all Markdown heading levels in the article body with a slim starting-edge border and faint fading tint. Use iris for first-level headings, foam for second-level headings, and gold for third-level headings. Bold text uses love adjusted for contrast. Preserve semantic heading levels, scale sizes by level, and allow long titles to wrap. Existing banner labels retain their styling.
- Move the existing course image above the first section heading in the Intro and Lesson 1, preserving the asset, alt text, and image optimization.
- This follow-up supersedes the earlier specifications' header banner styling and disclaimer placement.

## Testing Decisions

- Reuse the existing isolated article browser seam. Update layout assertions for navigation-before-source-before-title, summary-before-metadata, disclaimer-after-body, and a transparent header.
- Retain the theme, keyboard, disclosure, source-code, and overflow checks. Inspect the local lesson on desktop and mobile.

## Out of Scope

- Article prose, frontmatter, schemas, and course repository changes are unnecessary; only the existing course images' positions change within the content.
- Pushing remains excluded by the author's instruction.

## Verification

Verified locally on 2026-10-07.

| Story | Verdict | Evidence |
| --- | --- | --- |
| 1 - Plain introduction | pass | Production browser assertions confirm the summary follows the title and precedes metadata; headers have transparent backgrounds. |
| 2 - Closing disclaimer | pass | Production browser assertions place the disclaimer after the complete body and verify its existing banner styling. |
| 3 - Navigation and source | pass | Browser assertions place lesson navigation at the start of the article and source code between navigation and title. Existing link, keyboard, current-lesson, and pill checks pass. |
| 4 - Heading hierarchy | pass | Shared styles cover body heading levels with descending sizes. All theme/viewport Axe and overflow checks pass; desktop and mobile screenshots were inspected. |
| 5 - Course image placement | pass | Live browser checks confirm information, image, then first section ordering in both the Intro and Lesson 1; desktop and mobile screenshots were inspected. |

All 17 article browser tests pass after the final content changes and again after the heading-level and bold-text color refinement. Typechecking and production build pass. Independent standards and specification reviews found no actionable issues in the layout and shared heading styles. The development server remains running for author review.
