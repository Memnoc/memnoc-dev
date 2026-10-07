## Northstar

This repo follows the northstar engineering skills.

### Pipeline

Invoke `adr` (or `adr-with-docs`), then `to-spec`, `to-tickets`, and
`implement`: one ticket per fresh session, built with `tdd` and reviewed with
`crosscheck`. When all tickets are done, `harden` verifies the assembled
system; after shipping, `next` harvests the V2 agenda. Invoke `guided-mode`
when unsure.

### Artifacts

- `CONTEXT.md` — domain glossary, root
- `docs/adr/` — decision receipts, indexed in its README.md
- `docs/specs/` — specs, `YYYY-MM-DD-<slug>.md`
- `docs/research/` — research notes, same naming
- `docs/intake/` — digested stakeholder material, same naming
- `.scratch/<spec-slug>/` — tickets; disposable once the feature ships

All are created lazily on first write.

## Writing style

Use a single ASCII hyphen (`-`) for separators in prose and UI labels, for
example `1 - Lesson 1`. Do not use em dashes, en dashes, or double hyphens as
punctuation. Preserve required syntax such as CLI flags and Markdown frontmatter.
