# matteostara.com — Plan

Locked from grilling session. Single source of truth for site decisions. Update inline when a decision changes; this file is the canonical reference, not chat history.

---

## Positioning

Sr Engineer pivoting domain specialty toward **OS/kernel + compilers/language runtimes**. Not a junior portfolio. Portfolio = credential-building, not desperation.

**Audience:** hiring managers in kernel/compiler space (drewdevault, jvns, syshero, andrewkelley reference set). Recruiters reach the URL only via CV link.

**Tone target:** "this person can build, knows the domain, has fun with it, is a human being like me." Anti-LinkedIn.

---

## Launch model

Build private. **No public link anywhere** (CV / LinkedIn / applications / social) until the launch gate is fully met.

### Launch gate (all must be true)

- Built tier has **≥2 entries**:
  - ≥1 fully-original (r_command_line cleaned, OR a new original)
  - ≥1 personalized tutorial-work (StarScript or BYOL with named extensions clearly beyond the source material)
- Each Built entry: README has explicit **"what's mine vs source material"** section, builds clean, runnable example or asciinema cast, license file, known limitations called out
- AST viewer working (scope A1, see below)
- About page written
- Studying section live with current state
- `/writing` hidden from nav (revealed only once a real post lands)

---

## Identity

- Primary: **Matteo Stara**
- Subtitle/handle: **(memnoc)**
- Title shown: "Sr Systems / CX Engineering Lead" — **employer name omitted**
- ArtStation linked (humanizing)

### Landing one-liner

> Matteo Stara (memnoc)
>
> I write systems software in C and Rust. Compilers, mostly. Currently: an interpreter and notes from Crafting Interpreters.

"Currently" line updates every few weeks. Decays gracefully.

---

## Domain + hosting

- Domain: **memnoc.dev** (registered on Cloudflare Registrar, ~$12/yr)
- Hosting: **Cloudflare Pages** (free, edge CDN, git-push deploy)
- DNS: managed directly in Cloudflare (domain + hosting same account)

---

## Stack

**S1 — Astro + React island.**

- Astro static site
- TypeScript throughout
- MDX for blog posts
- React mounted **only as an island** for the AST viewer
- Content pages ship ~0 KB JS
- Boring stack on purpose — site is a tool, not a portfolio piece

Three.js: **dropped**. Wrong tool for 2D AST viz + wrong signal for niche.

---

## Information architecture (IA3)

- `/` — single landing page (everything below)
- `/writing` — dedicated section, **hidden from nav until first post exists**
- `/projects/<slug>` — per-project detail pages, added only when a project has real depth to share (post-mortem, architecture notes, design rationale). Not at launch.

---

## Landing page structure (top → bottom)

1. **Header**
   - Profile image (real photo, casual)
   - Name + (memnoc)
   - Nav: Home · About · Writing (hidden until populated) · Contact
   - Social row: GitHub, LinkedIn, ArtStation, RSS (added when /writing exists)
   - Theme toggle (sun/moon), top-right
2. **Hero**: one-liner (above)
3. **AST viewer** — inline, quiet framing, no theatrics. Scope = A1 (parse → SVG tree only). Tied to StarScript. Example caption: "Currently writing a Lox-flavored interpreter in C. Type something here, see the AST."
4. **Built tier**
   - Minimal cards: name · 1-line blurb · lang tags · status badge ("Original" / "Personalized from CI" / "WIP") · GitHub link
   - Honest framing enforced by status badge
5. **Studying tier**
   - Current state + 1-line note (e.g., "Reading: Crafting Interpreters, ch.22 — local variables / scope. The resolver pass took me a while.")
   - Updated every few weeks
6. **Writing** link (only visible once `/writing` populated)
7. **Contact** (email + GitHub + LinkedIn + ArtStation)

---

## About page (~600-900 words, narrative not CV-speak)

7 sections, syshero-shaped:

1. **Hook** — who you are now in ~3 sentences
2. **XDA / Memnoc origin** — ROM porting on HTC, back-engineering newer firmware to older devices, XDA-recognized status. *Lead the backstory with this.*
3. **Linguistics → languages bridge** — BA in Linguistic Mediation, MA in Linguistics (International Communication). Natural-language structure → programming-language structure. Why compilers feel natural.
4. **Professional path** — Linux/OSS years → Android (Java) → Frontend (TS/React) → current Sr role → systems pivot. One paragraph, not a CV timeline.
5. **Currently** — StarScript, BYOL, r_command_line. Honest about state of each.
6. **Outside** — painting (link to artstation.com/starart), baking (bread/pizza/cakes), custom keyboards (embedded angle).
7. **Contact**.

---

## Visual

- **Palette: Rosé Pine** — full token set as CSS variables (`base, surface, overlay, muted, subtle, text, love, gold, rose, pine, foam, iris`)
- **Theme toggle: Rosé Pine Dawn (light) ↔ Rosé Pine Moon (dark)**
  - Default: OS `prefers-color-scheme`
  - Manual override stored in `localStorage`
  - Sun/moon icon in header, top-right
- **Restraint rule**: mostly `text` on `base`. Accent (`foam` or `iris`) reserved for links + small highlights. Avoid every-token-sprinkled-everywhere trap.
- **Body font**: system sans (`-apple-system, ui-sans-serif, system-ui, ...`)
- **Mono**: JetBrains Mono or Berkeley Mono
- **Layout**: single-column, max-width content. No sidebars.

---

## AST viewer scope (A1)

- Text input → tokenize → parse → render SVG tree
- Tied to StarScript grammar (Lox subset)
- Renders **only the parse tree**. No eval. No token list shown separately.
- React island, mounted by Astro.
- Future upgrades (out of scope for v1): A2 token list panel; A3 step-through evaluation.

---

## Out of scope (impl-phase decisions, not grilled)

- Exact Rosé Pine accent assignment (links / hover / selected)
- Project detail page template — decide when first project earns one
- First writing post topic — wait for a real moment per the "no fabricated retrospectives" rule
- DNS pointer mechanics at Hostinger / CF Pages site setup
- README "what's mine vs source material" exact template wording
- Footer content (copyright? license note? "built with Astro" credit? — probably none)

---

## Future re-opens

- AST viewer **A2 upgrade** (add token list panel)
- **Genuine 3D viz** (page-table walker, cache hierarchy) — only when there's an underlying real project to back it. Three.js considered only then.
- `/writing` **cross-posting strategy** — revisit when 3+ posts exist
- Project detail pages — added per-project when depth justifies
- RSS — turn on with /writing

---

## Doc surface (per grill-with-docs skill)

- **CONTEXT.md:** not warranted yet. No domain glossary needed for a personal portfolio — "Built tier", "Studying", "AST viewer" are labels not domain terms.
- **ADRs:** none rise to the hard-to-reverse + surprising + real-trade-off bar. Closest (Astro over self-rolled SSG, minimalism over three.js, two-tier honesty model) are all reversible in days. Skip per skill criteria.
- This `PLAN.md` is the only doc surface at this stage.

---

## Reference sites (aesthetic anchors)

- syshero.org/about — chosen primary reference
- drewdevault.com — minimalism + restraint
- jvns.ca — honest "I'm learning this" framing
- andrewkelley.me — niche signal example
- bellard.org — extreme minimalism baseline
