# Article disclaimers and readable links

## Problem Statement

The C learning article displays its disclaimer as plain text with literal
Markdown markers. Several intended references use image syntax and render as
broken images. Readers need a distinct disclaimer and recognizable links.

## Solution

Show the author's disclaimer in a warm gold banner consistent with the existing
Rosé Pine themes. Render references as readable, underlined inline links with
clear hover and keyboard focus states. Preserve the author's prose and images.

## User Stories

1. As a reader, I can distinguish an author's disclaimer from the article body.
2. As an author, I can opt into the banner without requiring a disclaimer on
   existing posts or duplicating banner markup in Markdown.
3. As a reader, I can follow the C article's references as links rather than
   encountering broken images.
4. As a keyboard or mobile reader, I can identify and activate links, and read
   the banner without horizontal overflow in each supported theme.

## Implementation Decisions

- Optional, trimmed plain-text disclaimer metadata supplies the banner. Missing
  or empty values render no banner; existing required metadata remains required.
- Render a named complementary region after the article header, using theme
  tokens for its gold accent, background, and readable text.
- Article-body links retain underlines at rest, have distinct visited styling,
  and show a stronger underline and subtle highlight on hover or keyboard focus.
  Preserve the existing visible keyboard outline and safe wrapping of long URLs.
- Correct the C article's reference syntax while preserving targets and wording.
  Preserve its real images. Its body introduction uses a second-level heading
  because the article template already supplies the primary heading.

## Testing Decisions

- Reuse the existing production-browser article fixture seam. Verify optional
  disclaimer presence/absence, its author-written text, and keyboard navigation
  to a controlled external reference.
- Run existing article accessibility and width checks in all three themes,
  including the fixture containing a disclaimer and an inline reference.
- Inspect the actual local C article, checking its reference destinations,
  remaining images, mobile layout, and accessibility. Keep the user's dev server
  running; isolated production tests use a separate port during this session.

## Out of Scope

- Rewriting the article or fact-checking its claims.
- Altering navigation or project cards.
- Publishing, pushing, or changing the visibility of any draft.

## Verification

- TDD: the new optional-disclaimer browser test failed on the missing named
  banner before implementation, then passed with keyboard reference navigation.
- All nine existing and new article browser tests passed against an isolated
  production build on port 4325. A strengthened visible-background assertion
  also passed on a subsequent focused run.
- Typechecking, production build, and whitespace checks passed.
- The actual C article passed Axe and horizontal-overflow checks at 320 and
  1280 pixels in Dawn, Moon, and Rosé Pine. All eight corrected references are
  underlined HTTPS links, and both original local images load successfully.
  Desktop and mobile screenshots were visually inspected.
- The live dev server initially retained the previous stylesheet; invalidating
  the article template made the new banner styles appear without restarting
  the user's server. Production styling was verified independently.
- Crosscheck against the working diff from 38b197e: Standards — zero actionable
  findings; Spec — zero findings. Author prose outside the formatting correction
  was excluded from the review scope.
- At original verification, changes remained local with no commit, push, or deployment.
  On 2026-10-01 the author subsequently requested committing and pushing the
  website changes. The banner/link implementation and tests are included;
  the local article drafts and their content edits remain uncommitted.
