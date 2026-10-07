## Problem Statement

Readers need an obvious link to each lesson's source code near the beginning of the article. Existing banners also need recognizable symbols that reinforce their purpose.

## Solution

Add a source-code banner immediately after the article header, using the same compact shape and the Rosé Pine love accent. Add purposeful line icons alongside existing labels: code brackets for source code, a pencil for exercises, a lightbulb for solutions, an open book for sources, and an information symbol for disclaimers.

## User Stories

1. As a reader, I can open the C-course repository from the Intro and the lesson_1 folder from Lesson 1 through a visible source-code banner near the top.
2. As an author, I can add an optional GitHub source-code URL to any article's frontmatter, including repository, folder, or file links; invalid URLs produce a clear content error.
3. As a reader, I can identify banner purpose through both a meaningful icon and a text label, while solution disclosure arrows retain their expand/collapse meaning.
4. As a keyboard or screen-reader user, I can follow the source link and operate solutions without JavaScript; decorative icons do not add redundant announcements or tab stops.
5. As a reader, I can use every banner in Dawn, Moon, and Rosé Pine at narrow and wide viewports, with no overflow and accessible contrast.
6. As an author, I can keep existing articles without source-code metadata unchanged, and consult the README for the new field and icon meanings.
7. As a newcomer to the C-course repository, I can see its course banner, useful language/compiler/lesson badges, a concise lesson index, and commands that compile and run the first example.

## Implementation Decisions

- Optional sourceCode frontmatter is an HTTPS github.com repository URL with optional folder/file path. Reject credential-bearing URLs, non-GitHub hosts, and paths lacking an owner/repository. Validation is local; rendering and builds do not contact GitHub.
- Link the Intro to https://github.com/Memnoc/C_course and Lesson 1 to https://github.com/Memnoc/C_course/tree/main/lesson_1. These destinations were confirmed through the GitHub API after the author supplied the repository.
- Use a reusable Astro source-code banner below the header and above the optional disclaimer. Use love for its border/tint and contrast-adjusted love text for the label/link.
- Use small inline SVG icons drawn from one shared set of path definitions. Astro labels and generated Markdown callouts share the same artwork. Keep icons aria-hidden and nonfocusable; keep visible text labels and native solution markers.
- Keep Astro caches inside each build root so isolated fixtures do not share rendered content through the symlinked dependencies. This prevents stale Markdown output from hiding icon changes during verification.
- Run the project fallback fixture commands from their temporary build root, including a copied audit script, so image assets resolve within the isolated build.
- Do not add icons to lesson titles or tags. Icons describe informational and instructional banner purposes only.
- The author additionally requested a concise README refresh in C_course. Reuse the existing course artwork, link badges to C/GCC documentation and the written lessons, list actual lesson folders, and verify the Hello World commands. Do not add unsupported license or CI badges. Commit each repository locally without pushing, as explicitly requested.

## Testing Decisions

- Extend the isolated production article browser seam. Test the actual C-post links, placement before content, keyboard activation against a controlled external response, and absence on articles without metadata.
- Verify icon accessibility properties, preserved solution keyboard interaction, and existing rich Markdown behavior. Visually inspect whether shapes convey their intended meanings.
- Reuse all-theme, narrow/wide Axe and overflow checks. Probe invalid frontmatter in disposable builds, then run typechecking, production build, and the full verification suites.

## Out of Scope

- Fetching or executing course code during website builds: links only.
- Replacing article prose, course navigation, or image handling: existing behavior is retained.
- Automatically inferring future lesson paths: authors supply their intended URL explicitly.
- Publishing changes: this turn completes and previews the component locally.

## Verification

| Stories | Evidence |
| --- | --- |
| 1, 2, 6 | Production article checks cover repository/folder links, placement, and omitted metadata. Disposable builds reject invalid protocols, hosts, credentials, missing repositories, and normalized dot paths; a valid file URL with a line fragment builds. README documents the field. |
| 3, 4 | Browser checks cover decorative icon semantics, actual Tab navigation to the source link, keyboard activation, and native solution disclosure controls. |
| 5 | All three themes pass narrow/wide overflow and Axe checks. Moon label/link contrast was corrected after an initial failure. Desktop and mobile screenshots were visually reviewed. |
| 7 | Course banner matches the existing website asset. Three badge images return SVG successfully. README compiler commands build and run Hello World with warnings enabled; optimized assembly generation succeeds. |

- Typechecking and the production build pass.
- 100 automated tests pass: 43 main browser, 17 article, 1 project fallback browser, and 39 offline evidence/project/image checks.
- Image audit reports no errors and five existing warnings.
- Standards and specification reviews are complete. URL normalization and keyboard-test findings were fixed and confirmed resolved.
- Both repositories are to be committed locally; no push is authorized for this change.
