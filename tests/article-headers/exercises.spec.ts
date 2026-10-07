import { expect, test } from '@playwright/test';

test('reader can attempt an exercise and independently reveal answers without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto('/writing/exercises/');
    const assignment = page.getByRole('region', { name: 'Exercise: Exercise 1 — Print a greeting', exact: true });
    await expect(assignment).toBeVisible();
    await expect(assignment.locator('strong')).toHaveText('Hello, World!');
    await expect(assignment.getByRole('listitem')).toHaveCount(2);
    await expect(assignment.getByRole('link', { name: 'C reference' })).toHaveAttribute('href', 'https://example.com/c');

    const first = page.locator('summary').filter({ hasText: 'Solution: Exercise 1 — Print a greeting' });
    const second = page.locator('summary').filter({ hasText: /^Solution$/ });
    const answer = page.getByText('One possible answer:', { exact: true });
    const secondAnswer = page.getByText('Replace the string with your name.', { exact: true });
    await expect(answer).toBeHidden();
    await expect(secondAnswer).toBeHidden();
    await first.focus();
    await expect(first).toBeFocused();
    await expect(first).not.toHaveCSS('outline-style', 'none');
    await first.press('Enter');
    await expect(answer).toBeVisible();
    await expect(page.locator('pre').filter({ hasText: '#include <stdio.h>' })).toBeVisible();
    await expect(secondAnswer).toBeHidden();
    await second.click();
    await expect(secondAnswer).toBeVisible();
    const illustration = page.getByRole('img', { name: 'An illustration inside the answer' });
    await expect(illustration).toBeVisible();
    await expect(illustration).toHaveAttribute('src', /\/_astro\/.*\.webp$/);
    await expect(illustration).toHaveAttribute('srcset', /400w/);
    await expect(illustration).toHaveAttribute('width', '1600');
    await expect(illustration).toHaveAttribute('height', '1067');
    await first.press('Space');
    await expect(answer).toBeHidden();
    await expect(secondAnswer).toBeVisible();
    await expect(page.getByRole('region', { name: 'Exercise', exact: true })).toContainText('Change the greeting');
    await expect(page.locator('blockquote').filter({ hasText: 'An ordinary quotation' })).toBeVisible();
    await expect(page.locator('blockquote').filter({ hasText: '[!NOTE]' })).toBeVisible();
    await expect(page.locator('pre').filter({ hasText: '[!SOLUTION]' })).toBeVisible();
  } finally {
    await context.close();
  }
});
