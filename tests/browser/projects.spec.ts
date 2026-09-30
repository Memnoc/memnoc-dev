import { expect, test } from '@playwright/test';
import { savedProjects } from '../../src/project-metadata';
import AxeBuilder from '@axe-core/playwright';

test('visitors see saved GitHub metadata without live requests or a maturity upgrade', async ({ page }) => {
  const externalRequests: string[] = [];
  await page.route(/https:\/\/(api\.)?github\.com\//, async (route) => {
    externalRequests.push(route.request().url());
    await route.abort();
  });
  await page.goto('/');
  for (const [name, repository] of [
    ['CodeAtlas', 'Memnoc/CodeAtlas'], ['Drudwyn', 'Memnoc/tmux-drudwyn'],
  ] as const) {
    const card = page.getByRole('article', { name: new RegExp(`^${name} —`) });
    const saved = savedProjects[repository];
    await expect(card).toHaveCount(1);
    await expect(card.getByRole('link', { name: `View ${name} source` }))
      .toHaveAttribute('href', `https://github.com/${repository}`);
    await expect(card.getByText(saved?.description || 'No GitHub description available.', { exact: true })).toBeVisible();
    if (saved?.release) {
      await expect(card.getByRole('link', { name: `Latest release: ${saved.release.tag}` }))
        .toHaveAttribute('href', saved.release.url);
    } else {
      await expect(card.getByText(saved ? 'No published full release.' : 'Release information unavailable.')).toBeVisible();
    }
    await expect(card.getByText('Repository last pushed:', { exact: false }))
      .toContainText(saved?.pushedAt ? saved.pushedAt.slice(0, 10) : 'Unavailable');
    await expect(card.getByText('Metadata checked:', { exact: false }))
      .toContainText(saved?.checkedAt ? saved.checkedAt.slice(0, 10) : 'Not yet checked');
  }
  await expect(page.getByRole('region', { name: 'Current work' })
    .getByRole('article', { name: 'Drudwyn — Current work' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Built' })
    .getByRole('article', { name: /Drudwyn/ })).toHaveCount(0);
  expect(externalRequests).toEqual([]);
});

for (const theme of ['rose-pine', 'moon', 'dawn']) {
  test(`saved project cards remain readable on mobile in ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/');
    await page.getByRole('combobox', { name: 'Theme', exact: true }).selectOption(theme);
    for (const name of ['CodeAtlas', 'Drudwyn']) {
      const card = page.getByRole('article', { name: new RegExp(`^${name} —`) });
      await expect(card).toBeVisible();
      const bounds = await card.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
      expect(await card.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    }
    const results = await new AxeBuilder({ page }).include('.project-list').analyze();
    expect(results.violations).toEqual([]);
  });
}
