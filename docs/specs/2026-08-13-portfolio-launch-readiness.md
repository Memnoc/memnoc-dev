# Portfolio launch readiness

## Problem Statement

People visiting `memnoc.dev` are being asked to judge Matteo Stara's technical
credibility, but the Public draft currently mixes finished work, Current work,
training repositories, dead public links, and claims that the linked source
does not yet support. The site also publishes test content and a technically
inconsistent article, while lacking repeatable checks for its most important
public behavior. A hiring manager cannot reliably distinguish demonstrated
ability from direction or aspiration.

Matteo also needs the portfolio to reflect his current role without obscuring
the systems, distributed-systems, compiler, and low-level work the site exists
to showcase. His professional use of AI, his Applied AI study, and a formal AI
research role are distinct claims and must not be conflated.

## Solution

The Public draft presents only claims a visitor can verify. CodeAtlas and
Northstar become Built entries after their public default branches satisfy the
agreed evidence bar; StarScript becomes the featured Current work at its actual
stage; weaker or unavailable projects no longer masquerade as completed proof.
The copy identifies Matteo as a Sr. Software Engineer, accurately describes
AI-assisted connector development, and preserves systems engineering as the
portfolio's primary direction.

The draft remains directly reachable but unindexed and unpromoted until every
launch condition is verified. Published test content disappears, Writing stays
hidden until a reviewed genuine post exists, and the interactive demo becomes
an honest standalone Lox expression parser. A production-browser suite and
live public-repository checks make credibility requirements repeatable rather
than editorial promises.

## User Stories

1. As a hiring manager, I want every Built entry to link to public evidence for
   its claims, so that I can evaluate demonstrated work without taking the site
   on trust.
2. As a hiring manager, I want Original work distinguished from Adapted and
   extended work, so that I understand Matteo's contribution and the relevant
   source material.
3. As a visitor, I want CodeAtlas presented as the Original Built entry only
   after its public evidence passes, so that the classification has a concrete
   meaning.
4. As a visitor, I want Northstar presented as Adapted and extended only after
   its public evidence passes, so that its origin and Matteo's additions are
   both clear.
5. As a visitor, I want unfinished projects grouped under Current work with
   their real maturity, so that active learning is visible without being
   mistaken for completed proof.
6. As a visitor, I want StarScript described as an early bytecode VM, so that
   its site copy agrees with its public implementation.
7. As a visitor, I do not want dead or private project links presented as
   portfolio evidence, so that every offered path is useful.
8. As a visitor, I want the AST demo identified as a standalone browser-side
   Lox expression parser inspired by StarScript, so that I do not infer a code
   connection that does not exist.
9. As a visitor, I want valid Lox-subset expressions rendered as readable SVG
   trees, so that the demo provides a concrete interactive explanation of
   parsing.
10. As a visitor, I want malformed numbers, unterminated strings, unsupported
    characters, and incomplete expressions rejected with clear feedback, so
    that the demo never silently invents a valid program.
11. As a keyboard user, I want to operate navigation, theme selection, demo
    controls, inputs, and links with a visible focus indicator, so that the
    site is usable without a pointing device.
12. As a small-screen visitor, I want navigation, project information, prose,
    and the AST demo to remain readable and operable, so that the portfolio
    works on a phone without horizontal page overflow.
13. As a visitor using a screen reader, I want meaningful page structure,
    control names and states, error announcements, and non-redundant image
    alternatives, so that the site communicates the same information without
    relying on sight.
14. As a visitor, I want the theme to follow my operating-system preference
    until I make a persistent manual choice, so that the site is comfortable
    without flashing the wrong theme.
15. As a recruiter, I want Matteo's title and professional specialty stated
    accurately without exposing his employer, so that I understand his current
    seniority and work.
16. As a systems-oriented hiring manager, I want systems programming,
    distributed systems, compilers, and low-level tools to remain the site's
    central direction, so that the portfolio's intended specialty is
    unmistakable.
17. As a reader, I want Applied AI study described as study and writing rather
    than a formal research position, so that the site does not overstate
    Matteo's role.
18. As a reader, I want `labotteghina.gallery` used consistently, so that the
    humanizing art link reaches the active site.
19. As an author, I want draft posts excluded from indexes, tag pages, routes,
    and navigation signals, so that unfinished or technically unreviewed
    writing cannot leak into the public site.
20. As an author, I want Writing navigation to appear only when at least one
    reviewed, non-draft post exists, so that an empty section is not advertised.
21. As a direct visitor during the Public draft, I want the site to remain
    usable while carrying `noindex`, so that development access does not imply
    Launch.
22. As a search crawler, I want a page-level noindex directive during the
    Public draft, so that the unfinished portfolio is not added to search
    results.
23. As a person sharing a page after Launch, I want canonical and social
    metadata to identify the correct URL, title, and description, so that links
    have accurate previews and do not create duplicate identities.
24. As the repository maintainer, I want a pinned, reproducible production
    build in CI, so that dependency or compilation drift blocks publication.
25. As the repository maintainer, I want internal routes, published content,
    and Built-entry links checked automatically, so that broken public paths
    block Launch.
26. As the repository maintainer, I want automated accessibility smoke checks
    plus explicit keyboard and responsive-review gates, so that visual polish
    cannot hide basic usability regressions.
27. As the launch owner, I want the public default branches of CodeAtlas and
    Northstar reverified immediately before promotion, so that Built reflects
    current external evidence rather than an earlier audit.
28. As the launch owner, I want promotion to wait until every condition in the
    canonical launch gate passes, so that deployment is never confused with
    Launch.

## Implementation Decisions

- `PLAN.md` remains the canonical product and launch brief; `CONTEXT.md`
  supplies the evidence-bearing vocabulary used by this spec.
- Keep the existing static Astro architecture and use React only for the AST
  viewer island. This effort is an alignment and verification pass, not a
  framework rewrite.
- Treat Public draft versus Launch as one centrally controlled site state. The
  Public draft emits a page-level robots `noindex` directive without blocking
  crawlers in `robots.txt`; Launch removes that directive only after the gate
  passes.
- Use the approved positioning:
  - Title: **Sr. Software Engineer**.
  - Direction: systems software in C and Rust, compilers, distributed systems,
    and low-level tools.
  - Professional specialty: using AI to help build connectors between software
    systems.
  - Personal study: studying applied AI systems and writing about what is
    learned, without claiming an AI research role.
  - Omit the employer name.
- Represent Built entries and Current work as separate concepts rather than a
  single project list with cosmetic badges.
- The initial Built candidates are CodeAtlas as **Original** and Northstar as
  **Adapted and extended**. Do not promote either candidate until the live
  evidence check passes against its public default branch.
- A Built entry requires public working source, a clean build, a runnable
  example, licensing, known limitations, and an explicit account of original
  work versus source material.
- Feature StarScript under Current work and state that its current public
  implementation is an early bytecode VM with a hand-built instruction chunk.
  Do not claim parser, grammar, error-recovery, or AST-viewer integration work
  that the public branch does not contain.
- BYOL may appear as secondary Current work only after its warnings, licensing,
  provenance, and limitations are addressed. The Rust shell may appear as
  secondary Current work only after its repository becomes public.
  `r_command_line` does not appear.
- Remove the shell carousel and its simulated terminal. Present the AST viewer
  directly as a standalone browser-side parser inspired by the StarScript
  learning path.
- Keep the A1 expression subset: literals, identifiers, grouping, unary `!`
  and `-`, multiplication/division, addition/subtraction, comparisons, and
  equality. Render a parse tree only; do not evaluate expressions or expose a
  separate token panel.
- Reject unsupported characters instead of skipping them. Reject malformed
  numeric literals, unterminated quoted strings, trailing tokens, missing
  operands, and unclosed groups with concise user-facing errors. String escape
  syntax is not introduced by this effort.
- Make parser feedback accessible: the input has a persistent label, errors
  are announced, and the SVG has an accessible name while retaining node
  titles for visual users.
- Remove the thumbnail test post from production content. Mark the
  variable-resolution article draft until its explanation and example describe
  the same interpreter architecture and receive technical review.
- Derive Writing navigation visibility from the presence of at least one
  non-draft post. Draft content produces no index entry, tag route, post route,
  or navigation signal.
- Use `labotteghina.gallery` as the canonical art destination throughout.
- Preserve Rosé Pine Dawn/Moon behavior, including operating-system default and
  persistent manual override. Controls expose visible focus and current state.
- Add canonical URL, Open Graph, and social-card metadata through the shared
  page layout, with page-specific title and description values.
- Pin the package-manager version and install from the frozen lockfile in CI
  before the production build.
- Use a production-build browser suite as the principal verification surface.
  Run the real generated site, interact with it as a visitor, and assert
  externally observable outcomes rather than component internals.
- Add a live external-evidence check for CodeAtlas and Northstar. It uses their
  unauthenticated public GitHub surfaces rather than mocks because public
  reachability and evidence availability are the behavior under test.
- Keep this repository responsible for presentation, the launch gate, and
  cross-project verification. CodeAtlas, Northstar, StarScript, BYOL, and the
  Rust shell retain ownership of their own source, tests, decisions, licenses,
  provenance, limitations, and runnable examples.
- Add no analytics until a concrete measurement question exists.

## Testing Decisions

### 2026-09-29 amendment — separate live audits from CI

The launch owner approved removing live repository state from ordinary CI.
`Verify` retains typechecking, the production build, browser/accessibility
tests, and offline tests through the public `verifyBuiltEvidence` interface.
Those verifier tests use controlled HTTP responses and local source archives
to exercise success and failure behavior without contacting GitHub.
Browser tests assert the rendered project links without fetching their external
destinations, including the Current work link.
The live external-evidence seam remains a launch requirement, exercised by
`pnpm verify:evidence` in a separate weekly/manual audit workflow. Audit
failures must remain visible but must not gate ordinary CI or deployment.
This amends the original testing decisions below wherever they require live
evidence in the same CI job; historical acceptance results remain unchanged.

### Original testing decisions

- **Primary seam — production-built site in a browser.** Build and serve the
  real static output, then use a headless browser to assert positioning copy,
  project classification, hidden Writing state, draft exclusion, noindex,
  canonical/social metadata, theme behavior, keyboard operation, responsive
  layouts, accessibility smoke checks, and AST input-to-tree/error behavior.
  Nothing behind the generated page is mocked.
- **External evidence seam — public Built-entry repositories.** Query the
  unauthenticated public GitHub surface for CodeAtlas and Northstar and assert
  that each repository resolves, exposes the expected default branch, and
  makes the required evidence documents reachable. Do not replace this with a
  mocked GitHub response; the external visibility is the requirement.
- The production Astro build is the baseline compilation gate and uses a
  frozen lockfile. A build that installs by mutating dependency policy does not
  count as reproducible verification.
- Good tests assert what a visitor, crawler, keyboard user, or launch owner can
  observe. They do not assert React state, parser private methods, CSS selector
  structure, or the internal representation of project data.
- Exercise the AST grammar through its rendered browser interface, including
  valid precedence/grouping cases and every agreed invalid-input class. Add a
  narrower parser test seam only if browser tests cannot provide useful failure
  localization without becoming slow or brittle.
- Run automated accessibility checks at representative pages and states, then
  retain manual launch checks for keyboard flow and responsive behavior because
  automation cannot establish their full usability.
- This repository has no prior automated test suite to imitate. The existing
  successful Astro production build is the only prior verification behavior;
  the new suite establishes the repository's testing conventions.

## Out of Scope

- Changes inside CodeAtlas or Northstar — out; their evidence documentation and
  verification are owned and handled in those repositories.
- Further StarScript language implementation — out; this effort corrects the
  portfolio claim but does not build the missing parser.
- BYOL warning cleanup, license, or provenance work — out; those changes belong
  to BYOL before it can qualify for display.
- Publishing or implementing the Rust shell — out; the portfolio waits for a
  public repository rather than manufacturing substitute evidence.
- Rewriting the variable-resolution article or authoring a new post — out;
  unfinished writing remains draft and Writing remains hidden.
- RSS — out until Writing contains a reviewed genuine post.
- AST token panel or expression evaluation — out; these remain A2 and A3.
- Sharing parser code or grammar artifacts with StarScript — out until the
  StarScript implementation supplies a real integration seam.
- Project detail pages — out until an individual project has site-specific
  depth that cannot be served by its repository.
- A visual redesign, framework migration, or Three.js visualization — out; the
  existing restrained visual and static architecture remain appropriate.
- Analytics — out until a specific decision requires measurement.
- Employer, customer, or confidential connector details — out; professional
  positioning must not disclose them.

## Further Notes

- Product decisions and the complete launch gate are in
  [`../../PLAN.md`](../../PLAN.md); canonical terminology is in
  [`../../CONTEXT.md`](../../CONTEXT.md).
- At the 2026-08-13 audit, the public site served commit `b658e17` and publicly
  exposed both the thumbnail test post and the variable-resolution article.
- At the same audit, CodeAtlas was publicly reachable on `main`; its local
  checkout contained one additional commit not yet on the public branch.
  Northstar's local and public `main` both resolved to `3af681f`, and its skill
  validation and installer suites passed.
- CodeAtlas and Northstar are considered functionally ready in their V1 forms.
  A parallel session is closing the small evidence-documentation gaps in their
  own repositories. Their live default branches must still be rechecked before
  this site promotes them to Built.
- The current variable-resolution article explains tree-walk resolution using
  a variable-to-depth map but illustrates it with clox bytecode compiler code.
  Draft status prevents that mismatch from being presented as reviewed
  technical writing.

## Verification

**Hardened:** 2026-08-13

**Candidate revision:** `4a9bcfae788638b8a4d0ad32f313025a8120ffe8`

**Environment:** local production build served by `astro preview`, Chromium
headless browser, and unauthenticated public GitHub surfaces.

The frozen install left `pnpm-lock.yaml` unchanged. Typechecking passed, the
production build generated only `/`, `/about/`, and `/writing/`, all 31
production-browser/accessibility checks passed, and all 5 live Built-evidence
checks passed. The evidence check observed CodeAtlas `main@7c1262cc` and
Northstar `main@09af1324`. `labotteghina.gallery` returned HTTP 200;
StarScript's repository is public at `main@b1d57b2`; immutable source confirms
an early bytecode VM executing a hand-built instruction chunk.

| # | User story (verbatim) | Verdict | Observed evidence |
|---|---|---|---|
| 1 | As a hiring manager, I want every Built entry to link to public evidence for its claims, so that I can evaluate demonstrated work without taking the site on trust. | pass | Both rendered Built links returned successful public responses; the live evidence command passed every required category at the recorded revisions. |
| 2 | As a hiring manager, I want Original work distinguished from Adapted and extended work, so that I understand Matteo's contribution and the relevant source material. | pass | The production page exposed explicit `Original` and `Adapted and extended` labels, and Northstar's copy distinguished Matt Pocock's source system from Matteo's additions. |
| 3 | As a visitor, I want CodeAtlas presented as the Original Built entry only after its public evidence passes, so that the classification has a concrete meaning. | pass | CodeAtlas rendered as Original after live verification passed source, clean build, runnable instructions, MIT license, limitations, and original-work account at `7c1262cc`. |
| 4 | As a visitor, I want Northstar presented as Adapted and extended only after its public evidence passes, so that its origin and Matteo's additions are both clear. | pass | Northstar rendered as Adapted and extended after its exact public archive passed source, validation/install tests, runnable instructions, MIT license, limitations, and adaptation account at `09af1324`. |
| 5 | As a visitor, I want unfinished projects grouped under Current work with their real maturity, so that active learning is visible without being mistaken for completed proof. | fail | Built and Current work are separate and the maturity claim is accurate, but StarScript is now public while the rendered entry still says `Source currently unavailable` and offers no source link. Routed to ticket 08 after a read-only debug session confirmed stale static portfolio data and a regression test that preserves it. |
| 6 | As a visitor, I want StarScript described as an early bytecode VM, so that its site copy agrees with its public implementation. | pass | Public `main@b1d57b2` contains a bytecode VM dispatching `OP_CONSTANT`, `OP_NEGATE`, and `OP_RETURN`; `main.c` constructs the instruction chunk by hand, matching the rendered maturity claim. |
| 7 | As a visitor, I do not want dead or private project links presented as portfolio evidence, so that every offered path is useful. | pass | Both offered Built links were live; StarScript's unavailable URL was not linked; excluded training/unavailable projects were absent from Home and About. |
| 8 | As a visitor, I want the AST demo identified as a standalone browser-side Lox expression parser inspired by StarScript, so that I do not infer a code connection that does not exist. | pass | Home and About rendered the standalone/inspired-by boundary and no integration claim or shell framing. |
| 9 | As a visitor, I want valid Lox-subset expressions rendered as readable SVG trees, so that the demo provides a concrete interactive explanation of parsing. | pass | Browser checks rendered named SVG trees for literals, identifiers, grouping, unary, multiplicative, additive, comparison, and equality expressions with the expected precedence and associativity. |
| 10 | As a visitor, I want malformed numbers, unterminated strings, unsupported characters, and incomplete expressions rejected with clear feedback, so that the demo never silently invents a valid program. | pass | The rendered interface rejected every agreed invalid-input class, including trailing tokens and unclosed groups, announced the exact error, and removed any partial tree. |
| 11 | As a keyboard user, I want to operate navigation, theme selection, demo controls, inputs, and links with a visible focus indicator, so that the site is usable without a pointing device. | pass | Every rendered action on all generated pages accepted focus with a non-zero visible outline; keyboard activation of a parser example produced its tree, and navigation/theme/example state was programmatic. |
| 12 | As a small-screen visitor, I want navigation, project information, prose, and the AST demo to remain readable and operable, so that the portfolio works on a phone without horizontal page overflow. | pass | At 320 CSS pixels every generated page had no page-level horizontal overflow, named primary actions remained visible/enabled, and wide-tree scrolling stayed inside the parser region. |
| 13 | As a visitor using a screen reader, I want meaningful page structure, control names and states, error announcements, and non-redundant image alternatives, so that the site communicates the same information without relying on sight. | pass | Axe found no violations on Home, About, empty Writing, both themes, a valid tree, or an error state; headings, names, `aria-current`, `aria-pressed`, invalid state, alerts, and image semantics were observed. |
| 14 | As a visitor, I want the theme to follow my operating-system preference until I make a persistent manual choice, so that the site is comfortable without flashing the wrong theme. | pass | The first animation frame followed the emulated OS preference; a manual choice persisted through navigation and reload, with accessible current state. |
| 15 | As a recruiter, I want Matteo's title and professional specialty stated accurately without exposing his employer, so that I understand his current seniority and work. | pass | Home and About rendered `Sr. Software Engineer` and AI-assisted connector development; no employer/customer identity was present. |
| 16 | As a systems-oriented hiring manager, I want systems programming, distributed systems, compilers, and low-level tools to remain the site's central direction, so that the portfolio's intended specialty is unmistakable. | pass | Home and About both rendered systems software in C/Rust, distributed systems, compilers, and low-level tools. |
| 17 | As a reader, I want Applied AI study described as study and writing rather than a formal research position, so that the site does not overstate Matteo's role. | pass | Both primary pages framed Applied AI as study and writing and contained no AI-research job-title claim. |
| 18 | As a reader, I want `labotteghina.gallery` used consistently, so that the humanizing art link reaches the active site. | pass | Home and About used only `labotteghina.gallery`; its live endpoint returned HTTP 200. |
| 19 | As an author, I want draft posts excluded from indexes, tag pages, routes, and navigation signals, so that unfinished or technically unreviewed writing cannot leak into the public site. | pass | The build generated no post/tag routes; all known draft/test post and tag URLs returned 404 and their titles were absent. |
| 20 | As an author, I want Writing navigation to appear only when at least one reviewed, non-draft post exists, so that an empty section is not advertised. | pass | With no reviewed post, Writing was absent from navigation while direct `/writing/` showed a coherent empty state. |
| 21 | As a direct visitor during the Public draft, I want the site to remain usable while carrying `noindex`, so that development access does not imply Launch. | pass | All three production-built pages loaded and remained operable while emitting `noindex, follow`. |
| 22 | As a search crawler, I want a page-level noindex directive during the Public draft, so that the unfinished portfolio is not added to search results. | pass | Every generated page emitted `noindex, follow`; no `robots.txt` rule blocked those page paths. |
| 23 | As a person sharing a page after Launch, I want canonical and social metadata to identify the correct URL, title, and description, so that links have accurate previews and do not create duplicate identities. | pass | Production pages emitted absolute `memnoc.dev` canonicals and page-specific title, description, Open Graph, and Twitter metadata even during Public draft. |
| 24 | As the repository maintainer, I want a pinned, reproducible production build in CI, so that dependency or compilation drift blocks publication. | unverifiable | The exact pinned frozen install, typecheck, and build passed locally and the workflow contains those gates, but this candidate is nine commits ahead of `origin/main`; no CI run exists for the candidate revision. |
| 25 | As the repository maintainer, I want internal routes, published content, and Built-entry links checked automatically, so that broken public paths block Launch. | pass | The production-browser suite checked all generated/forbidden routes, publication state, and live Built links; the complete suite passed 31/31. |
| 26 | As the repository maintainer, I want automated accessibility smoke checks plus explicit keyboard and responsive-review gates, so that visual polish cannot hide basic usability regressions. | pass | Automated state/route accessibility checks passed; phone/desktop, focus, and programmatic-state gates passed; the manual review gate is checked in separately. |
| 27 | As the launch owner, I want the public default branches of CodeAtlas and Northstar reverified immediately before promotion, so that Built reflects current external evidence rather than an earlier audit. | pass | Hardening re-ran the unauthenticated live verifier immediately and recorded the current default branches and revisions above. |
| 28 | As the launch owner, I want promotion to wait until every condition in the canonical launch gate passes, so that deployment is never confused with Launch. | pass | The central state remained Public draft with `noindex`; the manual checklist is unchecked and no promotion was performed. |

### Between-the-slices checks

| Flow | Verdict | Observed evidence |
|---|---|---|
| Live evidence revision → rendered Built classification and claim | pass | Immutable evidence checks passed at the recorded public revisions before the production page's two classifications and claims were accepted. |
| Draft filtering → generated routes → navigation → Public draft metadata | pass | Only three pages were generated; draft/tag routes returned 404, Writing stayed out of navigation, and every surviving page carried noindex/canonical metadata. |
| OS theme → persistent override → route navigation → accessibility | pass | The initial frame followed OS state, override survived navigation/reload, and Axe passed both Dawn and Moon. |
| Parser valid/error states → focus/ARIA → narrow-screen containment | pass | Valid trees, every invalid class, focus retention, error announcement/state, and contained horizontal scrolling all passed through the browser. |
| Candidate workflow from frozen install through live evidence, build, and browser suite | unverifiable | Every command passed locally and CI orders them in one job, but the candidate has not been pushed and therefore has no actual CI execution. |
| Human keyboard, focus-order, 200% zoom, and physical narrow-screen review | unverifiable | `docs/pre-launch-checklist.md` defines the gate, but no human reviewer has completed and recorded it for this candidate. |
| Public draft → canonical launch gate → promotion decision | pass | The checklist mirrors the canonical gate, remains unchecked, and the site still emits noindex; deployment/promotion was not inferred from a successful build. |

### Unverifiable items and ship status

- Story 24 and the combined CI flow need this candidate pushed and a successful
  CI run URL recorded.
- The human review flow needs a named reviewer to complete and record the
  manual checklist against the candidate.

Story 5 failed because StarScript's newly public availability made the static
Current work availability copy stale. The diagnosed fix is routed to ticket 08;
hardening did not implement it inline.

No user acceptance of these unverifiable items has been recorded. Under the
hardening rule, this candidate is therefore **not yet shipped** and must remain
the unpromoted Public draft with `noindex`.
