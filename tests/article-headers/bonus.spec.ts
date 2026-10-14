import { expect, test } from '@playwright/test';

test('reader can use visible bonus material with a decorative icon and rich Markdown', async ({ page }) => {
  await page.goto('/writing/exercises/');
  const bonus = page.getByRole('region', { name: 'Bonus: Explore your compiler', exact: true });
  await expect(bonus).toBeVisible();
  await expect(bonus.locator('strong')).toHaveText('INT_MAX');
  await expect(bonus.locator('pre')).toContainText('#include <limits.h>');
  await expect(bonus.getByRole('link', { name: 'integer limits', exact: true }))
    .toHaveAttribute('href', 'https://example.com/limits');
  const icon = bonus.locator('svg');
  await expect(icon).toBeVisible();
  await expect(icon).toHaveAttribute('aria-hidden', 'true');
  await expect(icon).toHaveAttribute('focusable', 'false');
  await expect(bonus).toContainText('This optional exploration stays visible.');
});

test('Lesson 2 offers the complete limits-inspection program and compile commands', async ({ page }) => {
  await page.goto('/writing/lets_learn_c_no_ai_2/');
  const bonus = page.getByRole('region', { name: 'Bonus: Check your C implementation', exact: true });
  await expect(bonus).toBeVisible();
  const program = bonus.locator('pre').filter({ hasText: '#include <float.h>' });
  await expect(program).toContainText('int main(void)');
  await expect(program).toContainText('CHAR_BIT');
  await expect(program).toContainText('DBL_DIG');
  await expect(bonus.locator('pre').filter({ hasText: './check_limits' }))
    .toContainText('gcc -std=c17 -Wall -Wextra -Wpedantic');
  await expect(bonus).toContainText(/Your implementation['’]s values may differ/);
});

test('compiler flag labels stay on one line in the Bonus table at mobile and desktop widths', async ({ page }) => {
  for (const width of [320, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/writing/lets_learn_c_no_ai_2/');
    const bonus = page.getByRole('region', { name: 'Bonus: What do those compiler flags do?', exact: true });
    const labels = bonus.locator('tbody tr td:first-child code');
    await expect(labels).toHaveText(['-std=c17', '-Wall', '-Wextra', '-Wpedantic']);
    for (const label of await labels.all()) {
      const fragments = await label.evaluate(element => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return range.getClientRects().length;
      });
      expect(fragments).toBe(1);
    }
  }
});
