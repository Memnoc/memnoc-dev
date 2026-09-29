import { expect, test } from '@playwright/test';

test('visitor can discover and read published writing through navigation and tags', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('navigation').getByRole('link', { name: 'writing' }).click();
  await expect(page).toHaveURL(/\/writing\/?$/);
  await expect(page.getByRole('heading', { level: 2, name: 'Writing' })).toBeVisible();
  await expect(page.getByText('No reviewed writing is published yet.')).toHaveCount(0);

  const title = 'Get your brain to the gym!';
  await page.getByRole('link', { name: title, exact: true }).click();
  await expect(page).toHaveURL(/\/writing\/aoc-16_0\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();

  await page.getByRole('link', { name: '#aoc', exact: true }).click();
  await expect(page).toHaveURL(/\/writing\/tag\/aoc\/?$/);
  await expect(page.getByRole('heading', { name: '#aoc', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: title, exact: true }))
    .toHaveAttribute('href', '/writing/aoc-16_0');
  await expect(page.getByText('Variable resolution across scope boundaries')).toHaveCount(0);
});

test('visitor cannot discover or open unfinished writing', async ({ page, request }) => {
  const writingResponse = await page.goto('/writing/');
  expect(writingResponse?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 2, name: 'Writing' })).toBeVisible();
  await expect(page.getByText('Test post with thumbnail')).toHaveCount(0);
  await expect(page.getByText('Variable resolution across scope boundaries')).toHaveCount(0);

  for (const path of [
    '/writing/test-thumbnail/',
    '/writing/variable-resolution/',
    '/writing/tag/test/',
    '/writing/tag/compilers/',
    '/writing/tag/crafting_interpreters/',
    '/writing/tag/c_language/',
  ]) {
    const response = await request.get(path);
    expect(response.status(), `${path} must not be public`).toBe(404);
  }
});
