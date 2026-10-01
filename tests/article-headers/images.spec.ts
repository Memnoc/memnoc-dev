import { expect, test } from '@playwright/test';

test('body images reserve space and load lazily after the first, including reference-style Markdown', async ({ page }) => {
  await page.goto('/writing/without-summary/');
  const first = page.getByRole('img', { name: 'First local image', exact: true });
  const later = page.getByRole('img', { name: 'Later local image', exact: true });
  await expect(first).toHaveAttribute('loading', 'eager');
  await expect(later).toHaveAttribute('loading', 'lazy');
  for (const image of [first, later]) {
    await expect(image).toHaveAttribute('width', '1600');
    await expect(image).toHaveAttribute('height', '1067');
    await expect(image).toHaveAttribute('srcset', /400w/);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
});

test('a post with body images but no explicit thumbnail retains its placeholder', async ({ page }) => {
  await page.goto('/writing/');
  const thumbnail = page.getByRole('link', { name: 'Read An article without a summary', exact: true }).locator('img');
  await expect(thumbnail).toHaveAttribute('src', /^data:image\/svg\+xml,/);
  await expect(thumbnail).toHaveAttribute('width', '120');
  await expect(thumbnail).toHaveAttribute('height', '80');
  await expect(thumbnail).toHaveAttribute('alt', '');
});
