import { expect, test, type Locator, type Page } from '@playwright/test';

const publicDraftRoutes = ['/', '/about/', '/writing/'] as const;

async function forEachVisibleAction(
  page: Page,
  assertion: (action: Locator) => Promise<void>,
) {
  for (const path of publicDraftRoutes) {
    await page.goto(path);
    const actions = page.locator('a[href], button, input, select');

    for (let index = 0; index < await actions.count(); index += 1) {
      const action = actions.nth(index);
      if (await action.isVisible()) {
        await assertion(action);
      }
    }
  }
}

async function expectVisibleFocusIndicator(control: Locator) {
  await control.focus();
  await expect(control).toBeFocused();

  const focusStyle = await control.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    };
  });

  expect(focusStyle.outlineStyle).not.toBe('none');
  expect(focusStyle.outlineWidth).toBeGreaterThan(0);
}

async function expectNoPageOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
}

test('every rendered link and control keeps a visible keyboard focus indicator', async ({ page }) => {
  await forEachVisibleAction(page, expectVisibleFocusIndicator);
});

test('navigation, theme, and parser examples expose their current state', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'home' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('link', { name: 'about' })).not.toHaveAttribute('aria-current');
  await expect(page.getByRole('combobox', { name: 'Theme', exact: true })).toHaveValue('dawn');
  await expect(page.getByRole('button', { name: '1 + 2 * 3', exact: true })).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: '(a + b) * c', exact: true }).click();
  await expect(page.getByRole('button', { name: '1 + 2 * 3', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('button', { name: '(a + b) * c', exact: true })).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/about/');
  await expect(page.getByRole('link', { name: 'about' })).toHaveAttribute('aria-current', 'page');
});

test('AST input exposes invalid state and its announced error programmatically', async ({ page }) => {
  await page.goto('/');
  const input = page.getByRole('textbox', { name: 'Lox expression' });

  await input.fill('1 +');

  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAttribute('aria-describedby', 'lox-expression-error');
  await expect(page.locator('#lox-expression-error')).toHaveAttribute('role', 'alert');

  await input.fill('1 + 2');
  await expect(input).toHaveAttribute('aria-invalid', 'false');
  await expect(input).not.toHaveAttribute('aria-describedby');
});

test('decorative imagery is hidden while meaningful images keep accessible names', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('img', { name: 'Matteo Stara' })).toBeVisible();
  const decorativeGraphics = page.locator('svg:not([role="img"])');
  for (let index = 0; index < await decorativeGraphics.count(); index += 1) {
    await expect(decorativeGraphics.nth(index)).toHaveAttribute('aria-hidden', 'true');
  }
  await expect(page.locator('img[alt=""]')).toHaveCount(0);
});

for (const viewport of [
  { name: 'phone', width: 320, height: 800 },
  { name: 'desktop', width: 1280, height: 900 },
] as const) {
  test(`${viewport.name} pages have no horizontal overflow and primary actions remain reachable`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const path of publicDraftRoutes) {
      await page.goto(path);
      await expectNoPageOverflow(page);
    }

    await page.goto('/');
    const homePrimaryActions = [
      page.getByRole('link', { name: 'about' }),
      page.getByRole('combobox', { name: 'Theme', exact: true }),
      page.getByRole('link', { name: 'GitHub' }),
      page.getByRole('link', { name: 'LinkedIn' }),
      page.getByRole('link', { name: 'La Botteghina' }),
      page.getByRole('textbox', { name: 'Lox expression' }),
      page.getByRole('button', { name: '(a + b) * c', exact: true }),
      page.getByRole('link', { name: 'View CodeAtlas source' }),
      page.getByRole('link', { name: 'View Northstar source' }),
    ];

    for (const action of homePrimaryActions) {
      await expect(action).toBeVisible();
      await expect(action).toBeEnabled();
    }

    await page.getByRole('button', { name: '(a + b) * c', exact: true }).click();
    await expect(page.getByRole('img', { name: /Parse tree for/ })).toBeVisible();

    await page.goto('/about/');
    const aboutPrimaryActions = [
      page.getByRole('link', { name: 'home' }),
      page.getByRole('combobox', { name: 'Theme', exact: true }),
      page.getByRole('link', { name: 'labotteghina.gallery' }),
      page.getByRole('link', { name: 'memnochmod@gmail.com' }),
      page.getByRole('link', { name: 'github.com/Memnoc' }),
    ];

    for (const action of aboutPrimaryActions) {
      await expect(action).toBeVisible();
      await expect(action).toBeEnabled();
    }

    await forEachVisibleAction(page, async (action) => {
      await action.scrollIntoViewIfNeeded();
      const box = await action.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
    });
  });
}
