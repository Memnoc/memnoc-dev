import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function expectNoAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.map(({ id, nodes }) => ({
    id,
    targets: nodes.map(({ target }) => target),
  }));
  expect(violations).toEqual([]);
}

test('Home has no automated accessibility violations in Dawn, Moon, and Rosé Pine', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dawn');
  await expectNoAccessibilityViolations(page);

  await page.getByRole('combobox', { name: 'Theme', exact: true }).selectOption('moon');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'moon');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(35, 33, 54)');
  await expectNoAccessibilityViolations(page);

  await page.getByRole('combobox', { name: 'Theme', exact: true }).selectOption('rose-pine');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(25, 23, 36)');
  await expectNoAccessibilityViolations(page);
});

test('About has no automated accessibility violations', async ({ page }) => {
  await page.goto('/about/');

  await expectNoAccessibilityViolations(page);
});

test('Writing index has no automated accessibility violations in Dawn, Moon, and Rosé Pine', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/writing/');

  await expect(page.getByRole('heading', { level: 2, name: 'Writing' })).toBeVisible();
  await expectNoAccessibilityViolations(page);

  await page.getByRole('combobox', { name: 'Theme', exact: true }).selectOption('moon');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'moon');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(35, 33, 54)');
  await expectNoAccessibilityViolations(page);

  await page.getByRole('combobox', { name: 'Theme', exact: true }).selectOption('rose-pine');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(25, 23, 36)');
  await expectNoAccessibilityViolations(page);
});

test('valid AST tree has no automated accessibility violations', async ({ page }) => {
  await page.goto('/');
  const input = page.getByRole('textbox', { name: 'Lox expression' });

  await input.fill('(a + b) * c');
  await expect(page.getByRole('img', { name: /Parse tree for/ })).toBeVisible();
  await expectNoAccessibilityViolations(page);
});

test('AST error is announced without stealing input focus and has no automated violations', async ({ page }) => {
  await page.goto('/');
  const input = page.getByRole('textbox', { name: 'Lox expression' });

  await input.focus();
  await input.fill('1 +');

  await expect(page.getByRole('alert')).toHaveText('Expected an expression.');
  await expect(input).toBeFocused();
  await expectNoAccessibilityViolations(page);
});
