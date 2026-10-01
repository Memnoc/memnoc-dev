# Blog image pipeline

## Problem Statement

Blog photos currently download at their original size even in small thumbnails.
Authors need one reliable import step, ordinary Markdown authoring, and clear
feedback about missing or oversized images as the publication grows.

## Solution

Prepare one source image per asset, generate responsive WebP article images and
small thumbnails during Astro builds, and report image issues locally and in CI.
Originals are preserved outside the published tree. Generated variants stay out
of Git. The user approved this design on 2026-10-01.

## User Stories

1. As an author, I can import a photograph or diagram with a single command that
   prints ready-to-use Markdown and thumbnail metadata without changing my original.
2. As an author, I get an actionable error for invalid input, unsafe names, or
   an existing destination, without losing files or overwriting previous imports.
3. As a reader, I download an appropriately sized article image with reserved
   layout space; later images load lazily, and diagrams retain readable detail.
4. As a reader, I download small 120/240-pixel thumbnail variants on Writing,
   while posts without explicit thumbnail metadata retain their themed placeholder.
5. As a maintainer, I can check missing local references, bypassed optimization,
   source size, and generated image size without contacting external services.
6. As an author, I can still read existing articles with their original prose,
   image descriptions, and attribution after the three current blog images migrate.

## Implementation Decisions

- A local import command supports static JPEG, PNG, and WebP. It auto-orients,
  removes metadata, caps width at 1600 without enlargement, preserves alpha,
  uses lossless PNG compression for diagrams, and never overwrites destinations.
- Store normalized assets under a per-post directory inside the source assets
  tree. Use lowercase hyphenated post and image names. Preserve original bytes
  during migration in an ignored local archive outside the published tree.
- Native Astro image processing emits WebP at 400/800/1200/1600 pixels capped
  by source width, with sizes matching the article column. The first local body
  image loads eagerly; subsequent images load lazily. No runtime image service.
- Explicit optional image metadata is validated by Astro's image helper and
  rendered with an optimized image component. Remove first-image regex inference.
  Keep the existing placeholder behavior for posts without a thumbnail.
- The audit parses Markdown and HTML, including reference-style images and
  escaped paths. Missing local references are errors. Remote images are reported
  without fetching. Code examples do not count as references.
- Start with advisory budgets: 500 KB or over 1600 pixels for source assets,
  30 KB for generated thumbnail variants, and 300 KB for article variants.
  Report measured sizes and adjust through evidence rather than degrading diagrams.
- Integrate image tests and the audit into normal verification. A full output
  audit follows a fresh build; source-only checks remain available while writing.
- This is one end-to-end implementation ticket. Existing unpublished writing
  and unrelated uncommitted style changes are preserved; no push or deploy.

## Testing Decisions

- Real command invocations with temporary projects and generated image fixtures
  verify import dimensions, orientation, alpha, metadata removal, original-file
  preservation, destination conflicts, and invalid arguments.
- Audit CLI tests exercise actual Markdown, YAML, image files, and generated HTML
  fixtures. Assert errors and warnings through the public report, not internal helpers.
- Production-browser tests verify thumbnail resource selection, responsive
  article downloads, image dimensions, preserved alt text, lazy loading, and
  placeholders. Reuse existing accessibility and article suites.
- Run the real migration and inspect the diagram and photographs at mobile and
  desktop sizes. Record measured source and delivered-byte changes.

## Out of Scope

- AVIF generation, remote image hosting, or a CMS — evaluate later from measurements.
- Git history rewriting — historic image blobs remain intact.
- Article prose edits, publication-state changes, or committing the Drudwyn report.

## Verification

Verified locally on 2026-10-01 against Astro 6.4.6 production output.

| Story | Verdict | Executed evidence |
| --- | --- | --- |
| 1 — Import photographs and diagrams without modifying originals | pass | Real imports of all three assets; CLI fixtures verify EXIF rotation, metadata removal, dimensions, alpha, and unchanged source bytes. |
| 2 — Fail safely on invalid input and destination conflicts | pass | Real CLI tests reject unsafe names, missing/unsupported files, and repeated destinations; existing bytes remain unchanged. |
| 3 — Responsive article images with stable layout and later lazy loading | pass | Browser selects 400px at 375px/1× and 800px at desktop/1×; dimensions reserve space. Reference-style fixture verifies first eager/later lazy behavior. Actual C photo and diagram inspected at 375/1280px, including 2× displays. |
| 4 — Small explicit thumbnails and themed fallback | pass | Browser downloads optimized 120/240 variants; fixture with body images but no image metadata still uses its SVG placeholder. |
| 5 — Offline audit with missing-reference errors and size reports | pass | CLI fixtures cover YAML, Markdown, reference-style syntax, encoded paths, raw HTML, picture/source alternatives, srcset/data URIs, external warnings, and absent builds. Actual built audit exits 0. |
| 6 — Preserve existing article content through migration | pass | Byte comparison against pre-task Markdown, allowing only image paths and explicit image metadata, confirms unchanged prose, alt text, attribution, and draft state. Original image SHA-256 hashes recorded below. |

Checks: typecheck and build pass; 43 main browser tests, 11 article tests,
1 isolated project browser test, and 39 Node tests pass (8 image tests plus
31 existing evidence/project tests). Project fixture build makes no external
metadata requests. Tests used a separate preview port while the author's dev
server stayed running. No push or deployment performed.

Source bytes fell from 2,374,988 to 760,756 (68% reduction). Writing variants
range from 524 to 2,964 bytes. On a 375px/1× viewport the C article's two images
total 49,354 bytes rather than 1,311,101; desktop/1× uses 122,482 bytes.
The largest diagram variant is 271,656 bytes. The 638,847-byte lossless prepared
diagram source intentionally produces an advisory warning; all generated blog
variants are below their budgets.

Existing content observations: AOC contains two external web-page links written
as Markdown images (Gig and Advent of Code); the audit reports these without
fetching or rewriting the author's prose. The transparent study diagram's pale
labels retain detail on dark backgrounds but already have weak contrast in
Dawn, and dense labels remain small on phones. Compression preserves the
diagram's transparency; an authoring revision for theme-independent contrast
is separate from the image pipeline.

Originals archived under ignored `.local/image-originals/2026-10-01/`:

| Original | SHA-256 |
| --- | --- |
| brain-gym.jpg | `2df94c5c338fa3d2f166d1625857b0dc2f4fde85cd41ced06b81e803dda9673d` |
| c-logo.jpg | `798b6785edceeb24c61943f17ce87974ace37b3f7acea938a548a412997895bb` |
| how-to-study.png | `46abae021600551a8814b83f3903a50334046501ef59547eab34334815e1d77b` |

## Standards

Independent crosscheck: no documented standards violations or material
maintainability findings. Reviewer also observed the HTML-alternative audit gap
below; follow-up review confirmed its fix.

## Spec

Independent crosscheck found one P2: raw HTML alternatives could evade the audit.
A failing regression reproduced it; shared extraction now checks img/srcset and
picture/source candidates in source and built HTML, including data URI commas.
Follow-up review confirmed no remaining specification issues.

Final findings: Standards 0 outstanding; Spec 0 outstanding (1 resolved).
