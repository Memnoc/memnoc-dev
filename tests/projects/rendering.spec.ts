import { expect, test } from '@playwright/test';

test('saved missing values and never-observed projects have distinct honest fallbacks', async ({ page }) => {
  await page.goto('/');
  const codeAtlas = page.getByRole('article', { name: 'CodeAtlas — Original' });
  await expect(codeAtlas.getByText('No GitHub description available.')).toBeVisible();
  await expect(codeAtlas.getByText('No published full release.')).toBeVisible();
  await expect(codeAtlas.getByText('Repository last pushed: Unavailable')).toBeVisible();
  await expect(codeAtlas.getByText('Metadata checked: 2026-09-01 (UTC)')).toBeVisible();
  const drudwyn = page.getByRole('article', { name: 'Drudwyn — Current work' });
  await expect(drudwyn.getByText('No GitHub description available.')).toBeVisible();
  await expect(drudwyn.getByText('Release information unavailable.')).toBeVisible();
  await expect(drudwyn.getByText('Repository last pushed: Unavailable')).toBeVisible();
  await expect(drudwyn.getByText('Metadata checked: Not yet checked')).toBeVisible();
  await expect(drudwyn.locator('time')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Latest release:/ })).toHaveCount(0);
});
