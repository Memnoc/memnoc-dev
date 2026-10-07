## Problem Statement

Article bibliographies take up too much space, and readers cannot easily tell which lesson they are following or how lessons belong to a course.

## Solution

Keep sources visible in a compact Rosé Pine section. Show explicit course and lesson labels, starting with 0 — Intro and 1 — Lesson 1 for the C course, and a small navigation row that identifies the current lesson. The author confirmed this design on 2026-10-07.

## User Stories

1. As a reader, I can read and follow all existing source references in a smaller, more tightly spaced section without expanding it.
2. As an author, I can use a SOURCES Markdown callout with normal links, lists, and paragraphs, consistent with exercise callouts.
3. As a reader, I see the course name and numeric lesson label on each course article and in Writing and tag lists.
4. As a reader, I can navigate published lessons in numeric order within the same course and recognize the current lesson.
5. As an author, I can add optional course metadata with a nonnegative integer lesson number; zero denotes Intro. Articles without course metadata remain ordinary articles, and drafts are excluded from navigation.
6. As a reader, compact sources and course navigation remain readable, keyboard-accessible, and within the viewport in all three themes on mobile and desktop.
7. As a C-course reader, I can attempt a visible exercise in Lesson 1 based on writing, compiling, modifying, and inspecting Hello World, as additionally requested during implementation.

## Implementation Decisions

- Extend the existing Markdown banner transformation with a visible SOURCES section and a subdued accent. Use 13px text at the default root size, tighter line height and list/paragraph spacing, with accessible text colors.
- Convert the existing Intro and Lesson 1 source sections without changing their reference text or destinations.
- Add an optional course object containing a nonempty name and a nonnegative integer lesson number to the content schema. Group by the exact course name; reject duplicate published lesson numbers within a course to prevent ambiguous navigation.
- Assign the existing two C posts to C course at numbers zero and one. Keep titles and URLs intact.
- Use a shared course label in article headers and both listing views. Render an ordered course navigation row in article headers, with the current entry marked using aria-current. Sort numerically, include only published entries from the same course, and preserve Writing's existing date ordering.
- Document both source syntax and course frontmatter in the README.
- Add a four-step Hello World exercise before Lesson 1's recap, using the existing exercise banner.

## Testing Decisions

- Use the existing isolated production-build/browser seam for compact sources, numeric ordering, current state, draft isolation, and compatibility with non-course posts.
- Confirm existing source URLs survive conversion, sources are smaller than the article body, and the following Intro section retains normal styling.
- Exercise course links by keyboard and check all themes at narrow/wide viewports with Axe and overflow assertions. Include multi-digit ordering and an unrelated course fixture.
- Typecheck, build, run full repository checks, and inspect screenshots. Independently review standards and spec compliance.

## Out of Scope

- Automatic citation numbering or footnotes: the requested numeric scale refers to lessons.
- Course landing pages, progress tracking, enrollment, or completion totals: the current need is clear sequencing between published posts.
- Rewriting lesson prose or adding references: retain existing content.
- Pushing or deployment: not requested.

## Verification

Verified on 2026-10-07 using isolated production fixtures and the actual local development site.

| Story | Verdict | Evidence |
| --- | --- | --- |
| 1 — Compact visible references | pass | Both sections render as visible sources regions with 13px text versus 15.6px body text. Exact comparison confirms reference text and URLs were preserved. |
| 2 — Source authoring | pass | Actual posts build from the documented SOURCES marker with links, paragraphs, and lists. |
| 3 — Course labels | pass | Browser checks find Intro and Lesson 1 labels in headers, Writing, and the C tag list. |
| 4 — Course navigation | pass | Keyboard activation, current-page marking, numeric ordering of lessons 2/10, and isolation from unrelated courses verified. |
| 5 — Metadata and drafts | pass | Draft fixture routes return 404 and are omitted from navigation; ordinary posts have no course navigation. Disposable builds reject negative/fractional numbers, blank course names, and duplicate published numbers. |
| 6 — Accessible layouts | pass | Axe and overflow checks pass in all three themes at 320px and 1280px for both C posts. Local screenshots of the header, sources, and mobile exercise inspected. |
| 7 — Lesson 1 exercise | pass | Four-step Hello World exercise renders before the recap; browser checks verify the visible banner and four tasks. |

Typecheck and production build passed. All 98 tests passed: 43 production browser, 15 article browser, 1 project fallback browser, and 39 offline tests. Image audit has zero errors and the five existing advisory warnings. The requested development server was started on port 4321 for author review.

### Standards review

No code-standard or functional findings. One editorial judgment concerned the existing no-LLM disclaimer alongside the newly drafted exercise. Added an explicit Codex attribution within the exercise so its origin is clear for author review.

### Spec review

No missing requirements, incorrect implementations, or scope creep identified. Full checks and visual inspection subsequently completed. No unresolved code findings on either axis.
