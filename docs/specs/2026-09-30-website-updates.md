# Website navigation, writing, and synced projects

## Problem Statement

Visitors should see consistently capitalized navigation, a more inviting article
header that helps them decide what to read, and current information about
CodeAtlas and Drudwyn. Maintaining project information must not make website
deployment depend on another repository's build or GitHub availability.

## Solution

Show Home, About, and Writing in title case. Give blog articles a colored header
and an optional author-written TL;DR using the existing Rosé Pine themes. Show
CodeAtlas and Drudwyn on the homepage with periodically refreshed descriptions,
latest releases, and last-update information, retaining the last successful
values when a refresh fails.

## User Stories

1. As a visitor, I can navigate through Home, About, and Writing with their
   existing destinations and active-page indicators intact.
2. As a reader, I can scan an article's title, date, tags, and available TL;DR in
   a visually distinct header that remains readable on mobile and in every theme.
3. As an author, I can provide a TL;DR explicitly; older posts without one still
   render correctly without an empty summary panel.
4. As a visitor, I can find CodeAtlas and Drudwyn, follow their source and available
   release links, and see saved project information without waiting for GitHub.
5. As a maintainer, I can refresh project metadata periodically or manually,
   persisting successful results so subsequent deployments use them.
6. As a maintainer, I can deploy the website when GitHub is unavailable, a refresh
   fails, or either project's build fails, while failures remain diagnosable in
   the independent maintenance workflow.
7. As a visitor, I see honest fallback information when a project has no release
   or description, without an invented release or a false freshness claim.

## Implementation Decisions

- The three changes are independent implementation tickets, each built in a
  separate worktree and fresh agent session from the same planning commit.
- Navigation uses explicit title-case link text. Routing, conditional Writing
  visibility, and active-page semantics remain intact.
- The article header uses existing theme tokens, preserving the article's single
  primary heading, metadata, tags, and content. TL;DR content is optional,
  author-controlled content metadata, not generated during rendering or builds.
  Existing author-written descriptions may seed summaries where appropriate.
- The project targets are Memnoc/CodeAtlas and Memnoc/tmux-drudwyn. CodeAtlas
  already exists and must not be duplicated. Existing Northstar and StarScript
  entries remain present.
- Persist validated project metadata in the repository. Static website builds
  consume this saved snapshot without fetching GitHub metadata or building
  linked projects. Include a usable initial snapshot and explicit fallbacks.
- A scheduled and manually invokable maintenance workflow refreshes the snapshot.
  Use a daily schedule as an implementation default. Publish changes through an
  update pull request so accepted data reaches the normal website deployment
  path; an ephemeral workflow artifact alone does not satisfy persistence.
- Validate responses before replacing saved values. Failed project refreshes
  preserve that project's previous successful data and freshness timestamp;
  independent successful refreshes may still be saved. A repository with no
  published release is a valid case, not a transport failure.
- A failed linked-project build must neither gate metadata display nor block
  website deployment. Preserve the existing independent live evidence audit
  and ordinary local verification. Do not disable website checks to hide failures.
- Metadata freshness is not proof that a project meets the Built-entry evidence
  bar. Preserve provenance and maturity distinctions from the domain glossary;
  do not automatically classify Drudwyn as Built merely because sync succeeds.

## Testing Decisions

- Use the existing production-browser boundary for navigation, article headers,
  and rendered project information. Assert visible behavior, accessible names,
  destinations, theme readability, and mobile layout.
- Use the metadata refresh command/module boundary with controlled GitHub
  responses and temporary snapshot storage. Cover successful persistence,
  unavailable GitHub, malformed responses, rate limiting, no release, partial
  success, and preservation of previous data and timestamps after failure.
- Follow the existing offline evidence-verifier tests' approach of controlled
  external responses. Routine tests must not depend on live linked repositories.
- Verify the production build succeeds using saved data with metadata fetching
  unavailable and linked-project CI failing. Inspect workflow dependencies to
  establish that live project checks are outside the deployment path.
- Browser suites currently share port 4321: coordinate sequential browser test
  runs between workers. Development previews use 4322, 4323, and 4324 respectively.
- After merging all three tickets, run typechecking, offline evidence tests,
  production build, the browser suite, any new metadata tests, and assembled
  user-story verification through harden.

## Out of Scope

- Whole-site redesign — this work targets navigation labels and article headers.
- Automatic TL;DR generation — summaries remain author-controlled.
- Building or repairing CodeAtlas or Drudwyn — their failures are independent.
- Browser-side live GitHub polling — saved metadata supports a static site.
- Removing existing projects or changing the Public draft launch gate — neither
  is necessary for these changes.
- Editing or publishing the maintainer's untracked worktree tutorial notes —
  those are separate ongoing writing.

## Further Notes

The user approved the three feature scopes in the planning conversation. Daily
refresh and update pull requests are concrete implementation defaults for review.
If repository permissions prevent creating update pull requests, report the
specific setup requirement rather than silently losing refreshed data.

## Verification

Pending implementation and assembled-system hardening. No user story has yet
been verified against these changes.
