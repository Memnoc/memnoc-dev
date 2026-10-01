import { expect, test } from '@playwright/test';

test('article photographs use responsive generated assets with stable layout dimensions', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/writing/aoc-16_0/');
  const photo = page.getByRole('img', { name: 'A model brain surrounded by lightbulb-shaped paper clips on a dark background.', exact: true });
  await expect(photo).toHaveAttribute('src', /\/_astro\/.*\.webp/);
  await expect(photo).toHaveAttribute('srcset', /400w/);
  await expect(photo).toHaveAttribute('srcset', /1600w/);
  await expect(photo).toHaveAttribute('width', '1600');
  await expect(photo).toHaveAttribute('height', /\d+/);
  await expect(photo).toHaveAttribute('loading', 'eager');
  await expect.poll(() => photo.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  const mobileSrc = await photo.evaluate(img => (img as HTMLImageElement).currentSrc);
  const candidates = await photo.getAttribute('srcset');
  expect(candidates!.split(',').find(candidate => candidate.includes(new URL(mobileSrc).pathname))).toMatch(/400w\s*$/);

  await page.setViewportSize({ width: 1280, height: 900 });
  await expect.poll(() => photo.evaluate(img => (img as HTMLImageElement).currentSrc)).not.toBe(mobileSrc);
  const dimensions = await photo.boundingBox();
  expect(dimensions!.width).toBeLessThanOrEqual(632);
});

test('Writing downloads a small explicit thumbnail instead of the article original', async ({ page }) => {
  await page.goto('/writing/');
  const thumbnail = page.getByRole('link', { name: 'Read Get your brain to the gym!', exact: true }).locator('img');
  await expect(thumbnail).toHaveAttribute('src', /\/_astro\/.*\.webp/);
  await expect(thumbnail).toHaveAttribute('srcset', /120w/);
  await expect(thumbnail).toHaveAttribute('srcset', /240w/);
  await expect(thumbnail).toHaveAttribute('width', '120');
  await expect(thumbnail).toHaveAttribute('height', '80');
  await expect(thumbnail).toHaveAttribute('loading', 'lazy');
  await expect(thumbnail).toHaveAttribute('alt', '');
  await thumbnail.scrollIntoViewIfNeeded();
  await expect.poll(() => thumbnail.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  const src = await thumbnail.evaluate(img => (img as HTMLImageElement).currentSrc);
  const response = await page.request.get(src);
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('image/webp');
  expect((await response.body()).byteLength).toBeLessThan(30_000);
});
