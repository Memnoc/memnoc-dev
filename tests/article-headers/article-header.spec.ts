import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('reader can scan the author-written summary alongside article metadata', async ({ page }) => {
  await page.goto('/writing/aoc-16_0/');

  const article = page.getByRole('article');
  const header = article.locator('header');
  await expect(article.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(header.getByRole('heading', { level: 1, name: 'Get your brain to the gym!' })).toBeVisible();
  await expect(header.getByText('29 Sept 2026', { exact: true })).toBeVisible();
  await expect(header.getByRole('link', { name: '#aoc', exact: true })).toHaveAttribute('href', '/writing/tag/aoc');
  const summary = header.getByRole('region', { name: 'TL;DR', exact: true });
  await expect(summary).toBeVisible();
  await expect(summary).toContainText("Let's get our mojo back by programming an Advent of Code challenge in Typescript without any LLM");
  await expect(article.getByRole('heading', { name: 'Local set up', exact: true })).toBeVisible();
});

test('an older post without summary metadata keeps its body and tags without an empty panel', async ({ page }) => {
  await page.goto('/writing/without-summary/');

  const article = page.getByRole('article');
  await expect(article.getByRole('heading', { level: 1, name: 'An article without a summary' })).toBeVisible();
  await expect(article.getByRole('region', { name: 'TL;DR', exact: true })).toHaveCount(0);
  await expect(article.getByText('TL;DR', { exact: true })).toHaveCount(0);
  await expect(article).not.toContainText('A description is not an implicit TL;DR.');
  await expect(article.getByText('This older article still has its original body.', { exact: true })).toBeVisible();
  await article.getByRole('link', { name: '#legacy', exact: true }).click();
  await expect(page).toHaveURL(/\/writing\/tag\/legacy\/?$/);
  await expect(page.getByRole('link', { name: 'An article without a summary', exact: true }))
    .toHaveAttribute('href', '/writing/without-summary');
});

for (const theme of ['dawn', 'moon', 'rose-pine']) {
  for (const width of [320, 1280]) {
    test(`${theme} article headers are distinct, accessible, and fit at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const slug of ['aoc-16_0', 'without-summary']) {
        await page.goto(`/writing/${slug}/`);
        await page.getByRole('combobox', { name: 'Theme', exact: true }).selectOption(theme);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

        const header = page.getByRole('article').locator('header');
        const background = await header.evaluate(element => getComputedStyle(element).backgroundColor);
        expect(background).not.toBe('rgba(0, 0, 0, 0)');
        expect(background).not.toBe(await page.locator('html').evaluate(element => getComputedStyle(element).backgroundColor));
        const dimensions = await page.evaluate(() => ({
          client: document.documentElement.clientWidth,
          scroll: document.documentElement.scrollWidth,
        }));
        expect(dimensions.scroll).toBe(dimensions.client);

        for (const element of await header.locator('h1, h2, p, a').all()) {
          await expect(element).toBeVisible();
          const box = await element.boundingBox();
          expect(box!.x).toBeGreaterThanOrEqual(0);
          expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        }
        const tag = header.getByRole('link').first();
        await tag.focus();
        await expect(tag).toBeFocused();
        await expect(tag).not.toHaveCSS('outline-style', 'none');
        const { violations } = await new AxeBuilder({ page }).analyze();
        expect(violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }))).toEqual([]);
      }
    });
  }
}
