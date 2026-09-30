# memnoc.dev

Personal site and technical writing. Built with Astro 6 as a fully static site — no runtime server and no JS framework overhead on the critical path.

## Architecture

Astro's island architecture: pages render to static HTML at build time. The
standalone Lox expression parser on the home page hydrates client-side as an
isolated React 19 island. Everything else ships zero framework JavaScript.

Content is managed through Astro's typed content layer — blog posts are Markdown files with Zod-validated frontmatter, compiled to static routes at build time. No CMS, no database.

The navigation's Theme dropdown offers Rosé Pine, Moon, and Dawn across the
site and blog. Choices persist across pages and reloads; without a saved
choice, the site uses Moon for a dark system preference and Dawn for light.

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Astro 6 | Static-first, island architecture, zero JS by default |
| Islands | React 19 | Selective hydration for interactive components only |
| Content | Astro content collections + MDX | Type-safe frontmatter, static route generation |
| Styling | Plain CSS, Rosé Pine tokens | No build step, no runtime style injection |
| Hosting | Cloudflare Pages | Edge CDN, git-push deploy, no bandwidth billing |
| Domain | Cloudflare Registrar | Single control plane for DNS + TLS + deploy |

## Local verification

Requires Node ≥ 22.12. The repository pins pnpm in `package.json`; Corepack or
another package-manager launcher can use that exact version.

```sh
pnpm install --frozen-lockfile        # install without changing pnpm-lock.yaml
pnpm typecheck                        # typecheck TypeScript
pnpm test:evidence                    # offline evidence-verifier tests
pnpm test:projects                    # offline project-refresh tests
pnpm build                            # production output → dist/
pnpm exec playwright install chromium # one-time local browser install
pnpm test:browser                     # production browser + accessibility suite
pnpm test:projects:browser            # isolated offline build + project fallbacks
pnpm test:accessibility               # focused accessibility/assembled-quality checks
```

Normal `Verify` CI runs typechecking, the offline evidence and project-refresh tests,
the production build, and both browser suites. The verifier
tests use controlled HTTP responses and a local source archive; they never
contact linked repositories.

For a live audit, `pnpm verify:evidence` queries the unauthenticated public default branches of
CodeAtlas and Northstar. It fails if either repository or default branch is
unavailable, or if working source, a clean verification run, runnable
instructions, licensing, known limitations, or the agreed provenance account
is missing. CodeAtlas's public CI must pass at the verified revision;
Northstar's validation and installer suites run from a revision-pinned archive.
The separate [Audit public Built evidence](.github/workflows/evidence-audit.yml)
workflow runs this command each Monday at 08:23 UTC and supports manual runs
from GitHub Actions. Audit failures remain visible in that workflow and do
not gate ordinary CI or deployment. Run a fresh live audit before launch and
record its reported revisions in the checklist.

Before promoting the Public draft as the launched portfolio, complete
[`docs/pre-launch-checklist.md`](docs/pre-launch-checklist.md). Deployment does
not remove `noindex` or satisfy the launch gate by itself.

The browser suite always runs against Astro's production preview server. Run
`pnpm build` first so `dist/` reflects the source under test. For day-to-day
development, `pnpm dev` starts the HMR server at `localhost:4321`.

## Saved project metadata

CodeAtlas and Drudwyn read `src/data/projects.json` at build time. There are no
project metadata requests from the build or browser. `Repository last pushed`
is GitHub's `pushed_at` (repository push activity, not proof of a passing build);
`Metadata checked` is the last complete, successful metadata observation in UTC.
Failed refreshes leave both the saved values and that observation time unchanged.
Missing descriptions, no published full release, and never-observed projects have
explicit fallbacks. Sync does not promote Drudwyn into Built or change provenance.

Run `pnpm refresh:projects` manually to update the saved file. An optional
`GITHUB_TOKEN` authenticates API reads; no token is needed for public data within
GitHub's unauthenticated rate limit. The command exits nonzero and names each
failure, while atomically saving independently successful repositories. Requests
time out after 15 seconds. Review and commit the snapshot before deployment.

The [Refresh saved project metadata](.github/workflows/refresh-projects.yml)
workflow runs daily at 07:41 UTC and supports **Run workflow**. Once integrated
on the default branch, it opens or updates `automation/project-metadata`, carrying
forward successful observations from a pending update PR. Only the snapshot is
committed. Partial successes reach the PR before the job reports refresh failures.
No project source is downloaded or built by this workflow.

Setup requirements (remote settings were not changed during implementation):

- Allow GitHub Actions and `peter-evans/create-pull-request` under repository or
  organization action policies. The workflow requests `contents: write` and
  `pull-requests: write` for the website repository.
- Enable **Settings → Actions → General → Workflow permissions → Allow GitHub
  Actions to create and approve pull requests**. If policy denies it, the PR step
  fails visibly; the saved file does not reach deployment until a PR is accepted.
- For PRs created with `GITHUB_TOKEN`, approve pending Verify workflow runs using
  **Approve workflows to run**, then review and merge normally. Do not bypass
  website checks. A separately configured GitHub App token is an alternative if
  automatically starting those checks is required.

Refresh and live evidence audit workflows have no dependency in `Verify` or the
Cloudflare `pnpm build` deployment command. The isolated project browser suite
first proves the evidence audit rejects controlled failing CI, then builds with
metadata unavailable and asserts the build makes zero external fetch requests.
It serves a temporary snapshot to verify fallback text without changing `dist/`.
Both browser suites use port 4321 sequentially. Ticket 03 development uses
`pnpm dev --port 4324` during parallel work.

API and automation references consulted for this implementation:
[repository metadata](https://docs.github.com/en/rest/repos/repos#get-a-repository),
[latest full releases](https://docs.github.com/en/rest/releases/releases#get-the-latest-release),
[workflow scheduling and permissions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax),
[Actions PR permissions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository),
[GITHUB_TOKEN workflow behavior](https://docs.github.com/en/actions/concepts/security/github_token),
and [create-pull-request](https://github.com/peter-evans/create-pull-request).

## Structure

```
src/
  components/       # React island (standalone Lox expression parser)
  content/blog/     # Markdown posts — typed via Zod schema
  content.config.ts # Content collection schema
  layouts/Base.astro
  pages/            # File-based routing
  styles/global.css # Rosé Pine Moon/Dawn theme, CSS custom properties
public/
  favicon.svg       # SVG favicon with light/dark prefers-color-scheme
```

## Deploy

Push to `main` → Cloudflare Pages builds and deploys automatically. Build command: `pnpm build`. Output: `dist/`.

No environment variables required.
