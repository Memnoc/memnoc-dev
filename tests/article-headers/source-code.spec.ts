import { expect, test } from '@playwright/test';

test('readers can reach each C lesson source near the top using the keyboard', async ({ page }) => {
  for (const [slug, url] of [
    ['lets_learn_c_no-ai_0', 'https://github.com/Memnoc/C_course'],
    ['lets_learn_c_no-ai_1', 'https://github.com/Memnoc/C_course/tree/main/lesson_1'],
  ]) {
    await page.goto(`/writing/${slug}/`);
    const banner = page.getByRole('complementary', { name: 'Source code', exact: true });
    await expect(banner).toBeVisible();
    const link = banner.getByRole('link', { name: 'View source on GitHub', exact: true });
    await expect(link).toHaveAttribute('href', url);
    const header = await page.locator('.post-header').boundingBox();
    const navigation = page.getByRole('navigation', { name: 'C course lessons', exact: true });
    const navigationBox = await navigation.boundingBox();
    const articleBox = await page.getByRole('article').boundingBox();
    const source = await banner.boundingBox();
    const disclaimer = await page.getByRole('complementary', { name: 'Disclaimer', exact: true }).boundingBox();
    expect(navigationBox!.y).toBe(articleBox!.y);
    expect(source!.y).toBeGreaterThanOrEqual(navigationBox!.y + navigationBox!.height);
    expect(source!.y + source!.height).toBeLessThanOrEqual(header!.y);
    expect(source!.y + source!.height).toBeLessThanOrEqual(disclaimer!.y);
    for (let step = 0; step < 20 && !await link.evaluate(element => element === document.activeElement); step++) {
      await page.keyboard.press('Tab');
    }
    await expect(link).toBeFocused();
    await expect(link).not.toHaveCSS('outline-style', 'none');
    await page.route(url, route => route.fulfill({ contentType: 'text/html', body: '<title>Lesson source</title>' }));
    await link.press('Enter');
    await expect(page).toHaveURL(url);
  }
  await page.goto('/writing/without-summary/');
  await expect(page.getByRole('complementary', { name: 'Source code', exact: true })).toHaveCount(0);
});

test('banner icons supplement text labels without adding announcements or changing disclosure controls', async ({ page }) => {
  await page.goto('/writing/lets_learn_c_no-ai_1/');
  for (const banner of [
    page.getByRole('complementary', { name: 'Source code', exact: true }),
    page.getByRole('complementary', { name: 'Disclaimer', exact: true }),
    page.getByRole('region', { name: 'Exercise: 1 - Make Hello World your own', exact: true }),
    page.getByRole('region', { name: 'Sources', exact: true }),
  ]) {
    const icon = banner.locator('svg');
    await expect(icon).toHaveCount(1);
    await expect(icon).toBeVisible();
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(icon).toHaveAttribute('focusable', 'false');
    await expect(banner.getByRole('img')).toHaveCount(0);
  }
  await page.goto('/writing/exercises/');
  const summary = page.locator('summary').first();
  await expect(summary.locator('svg')).toBeVisible();
  await expect(summary).toHaveCSS('display', 'list-item');
  await summary.focus();
  await summary.press('Enter');
  await expect(page.getByText('One possible answer:', { exact: true })).toBeVisible();
});
