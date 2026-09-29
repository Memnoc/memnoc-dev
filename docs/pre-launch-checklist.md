# Pre-Launch checklist

This is the repeatable manual gate for promoting `memnoc.dev`. A deployed site
with `noindex` is still the **Public draft**. It becomes **Launch** only after
every automated and manual item below passes against the exact revision being
promoted and the launch owner deliberately removes `noindex`.

Record the candidate revision, date, reviewer, viewport/device, browser, and
evidence links beside each result. Leave an item unchecked when it is not
verified; deployment is not evidence of completion.

- Candidate revision:
- Review date:
- Reviewer:
- Public draft URL:
- Phone/browser:
- Desktop/browser:

## Automated preflight

- [ ] `pnpm install --frozen-lockfile` succeeds with the pinned package manager.
- [ ] `pnpm typecheck` succeeds.
- [ ] `pnpm build` produces the static site.
- [ ] `pnpm test:browser` passes the complete production-built browser suite,
  including the automated accessibility checks on Home, About, the empty or
  hidden Writing state, Dawn and Moon, a valid AST tree, and an AST error.
- [ ] `pnpm test:evidence` passes the offline verifier tests.
- [ ] `pnpm verify:evidence` (or a manual **Audit public Built evidence** run)
  passes against the current public default branches
  of CodeAtlas and Northstar. Record the reported branch and commit for each.
- [ ] The candidate CI run passes frozen install, typecheck, offline evidence
  tests, production build, and the full browser/accessibility suite in one
  job. CI run URL:

## Manual visitor review

### Keyboard and focus

- [ ] Starting at the address bar, traverse Home using only Tab and Shift+Tab.
  Visit the build link, navigation, theme control, contact links, Lox input,
  every parser example, and both Built-entry source links.
- [ ] Traverse About and the directly reachable empty Writing page using only
  Tab and Shift+Tab.
- [ ] Focus order follows the visual and reading order, never traps focus, and
  reaches every action without a pointer.
- [ ] Every focused link, button, and input has a clearly visible indicator in
  both Dawn and Moon; the indicator is not clipped or hidden by component
  styles.
- [ ] Activate navigation, theme selection, parser examples, and links with
  the keyboard. Current navigation, theme, and parser-example state is conveyed
  programmatically as well as visually.
- [ ] Enter an invalid AST expression. The error is announced without moving
  focus away from the Lox input; correcting it restores the named parse tree.

Evidence/notes:

### Zoom, readability, and narrow screens

- [ ] At 200% browser zoom on desktop, text remains readable, content is not
  clipped or overlapped, and all actions remain operable.
- [ ] At 320 CSS pixels wide (or an equivalent phone), review Home, About, and
  the empty Writing page. Navigation wraps coherently; project status, prose,
  and controls remain readable; primary actions remain reachable; the page has
  no horizontal overflow.
- [ ] Enter a wide AST expression on the phone viewport. Horizontal scrolling
  is contained inside the parse-tree region and does not move the whole page.
- [ ] Rotate or resize between phone and desktop widths. No content or action
  becomes unreachable.

Evidence/notes:

### Theme and assistive presentation

- [ ] With no saved choice, the first painted theme follows the operating
  system without a wrong-theme flash.
- [ ] A manual Dawn/Moon choice persists through navigation and reload, and
  both themes retain readable contrast and visible focus.
- [ ] With a screen reader, page headings and landmarks identify Home, About,
  Writing, Built, Current work, and the Lox parser coherently.
- [ ] Meaningful imagery has an accessible name. Decorative icons and imagery
  are silent and do not duplicate adjacent link names.

Evidence/notes:

## Canonical `PLAN.md` launch gate

The following mirrors every condition under `PLAN.md` → **Launch gate**. The
plan is canonical if wording or scope changes; update this checklist in the
same change.

- [ ] Built contains at least two externally verifiable entries: CodeAtlas is
  **Original** and Northstar is **Adapted and extended**.
- [ ] Each Built entry's current public default branch provides working source,
  a clean build, a runnable example, a license, known limitations, and an
  explicit account of original work versus source material.
- [ ] Every Project claim on the site is verified against the linked project's
  current public default branch.
- [ ] CodeAtlas has its license and provenance boundary, its latest intended
  work is public, and its full verification is green at the recorded commit.
- [ ] Northstar has the corrected `adr` description, Known Limitations,
  adaptation/original-work boundary, and green validation and installer tests
  at the recorded commit.
- [ ] The standalone AST viewer satisfies A1 and its parser behavior tests pass.
- [ ] About reflects the current role and technical direction accurately.
- [ ] Current work is live and states each project's actual maturity.
- [ ] Writing remains absent from navigation until a corrected, reviewed
  genuine post exists.
- [ ] The thumbnail test post is absent from generated routes and indexes.
- [ ] CI verifies the pinned build, parser behavior, internal content, public
  project links, focused accessibility checks, and responsive browser checks.
- [ ] A human reviewer completes and records the manual keyboard review in this
  checklist; CI does not substitute for that usability judgment.
- [ ] Canonical and social metadata are correct for every generated page.

Evidence/notes:

## Ticket 07 acceptance record

- [ ] Automated accessibility smoke checks pass on Home, About, empty/hidden
  Writing, both themes, a valid AST tree, and an AST error state.
- [ ] Every interactive control and link retains a visible focus indicator.
- [ ] Current control state and parser errors are programmatic, errors do not
  steal focus, and decorative imagery is hidden from assistive technology.
- [ ] Phone and desktop production-browser checks show no page-level horizontal
  overflow and all primary actions remain reachable.
- [ ] Manual keyboard traversal, focus order, zoom/readability, narrow-screen
  interaction, theme behavior, and current public Built evidence are recorded.
- [ ] Public draft and Launch remain distinct, and every canonical launch-gate
  condition above is checked before promotion.
- [ ] CI passes frozen install, typecheck, offline evidence tests, build, and
  the full browser/accessibility suite. A separate live public Built-evidence
  audit passes before promotion; its result does not gate ordinary deployment.

## Promotion decision

- [ ] Every item above is checked and backed by evidence for the candidate
  revision.
- [ ] The launch owner approves promotion. Owner/date:
- [ ] Only now, change the central site state from `public-draft` to `launch`,
  verify the generated pages no longer emit `noindex`, rerun the complete gate,
  and record the final CI/deployment URL.

If any item fails, keep the deployment as the unpromoted Public draft with
`noindex`; record the blocker rather than checking or weakening the item.
