# Rosé Pine theme selection

Add the original Rosé Pine palette as a third site-wide theme so readers can
use the same theme on the blog as in their own setup.

- Provide a native, keyboard-accessible Theme dropdown with Rosé Pine, Moon,
  and Dawn choices. The selected option exposes the current state.
- Use the [official Rosé Pine palette](https://rosepinetheme.com/id/palette/)
  for the original variant, preserving readable text tokens for accessibility.
- Save choices in the existing `rp-theme` preference and restore them before
  first paint, including on direct article visits and reloads.
- Preserve existing Moon and Dawn preferences. With no saved preference,
  continue to choose Moon for dark operating systems and Dawn for light ones.
- An explicit selection takes priority over the operating-system preference.
- Keep the selector usable at a 320px viewport and visibly focused by keyboard.

## Verification

Use the existing production-browser seam: select each theme, navigate to an
article, reload, verify the selected value and actual rendered colors, and
check saved Rosé Pine on the first animation frame under a dark system theme.
Run keyboard selection, focus/overflow checks, and Axe on Home and Writing
in all three variants. Existing Dawn/Moon persistence tests remain in place.
