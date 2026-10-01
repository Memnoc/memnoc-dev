# 01 — Import, render, and audit blog images

**Spec:** `docs/specs/2026-10-01-blog-image-pipeline.md`

**What to build:** Authors import one image and write ordinary Markdown;
readers receive responsive article images and small explicit thumbnails;
maintainers get actionable image reports and preserved migration originals.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] Import CLI normalizes static photographs/diagrams and prints authoring paths.
- [x] Invalid input and name collisions never damage originals or existing imports.
- [x] Article images and explicit thumbnails use Astro's optimized responsive output.
- [x] Missing thumbnails keep their themed placeholder, without regex inference.
- [x] Audit reports sizes and bypasses and fails on missing local references.
- [x] Migrate the three current images with byte-preserved local original backups.
- [x] CLI and browser tests, typecheck, build, crosscheck, and user-story verification pass.
- [x] Document authoring commands, budgets, limitations, and measured size results.
