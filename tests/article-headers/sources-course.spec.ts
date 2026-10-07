import { expect, test } from '@playwright/test';

test('existing C sources stay visible and compact without shrinking subsequent article sections', async ({ page }) => {
  await page.goto('/writing/lets_learn_c_no-ai_1/');
  const sources = page.getByRole('region', { name: 'Sources', exact: true });
  await expect(sources).toBeVisible();
  await expect(sources.getByRole('link', { name: /Publisher.s page/ })).toHaveAttribute('href', 'https://www.pearson.com/en-us/subject-catalog/p/c-programming-language/P200000003426');
  await expect(sources.getByRole('link', { name: 'Impariamo il C: lezione 1' })).toHaveAttribute('href', 'https://www.youtube.com/watch?v=HjXBXBgfKyk');
  const size = await sources.evaluate(element => parseFloat(getComputedStyle(element).fontSize));
  const bodySize = await page.locator('.post-body').evaluate(element => parseFloat(getComputedStyle(element).fontSize));
  expect(size).toBeLessThanOrEqual(bodySize * 0.85);

  await page.goto('/writing/lets_learn_c_no-ai_0/');
  const introSources = page.getByRole('region', { name: 'Sources', exact: true });
  await expect(introSources.getByRole('link', { name: 'K&R', exact: true })).toBeVisible();
  const followingHeading = page.getByRole('heading', { name: 'Stop watching, start learning' });
  await expect(followingHeading).toBeVisible();
  await expect(introSources.getByRole('heading')).toHaveCount(0);
  expect(await followingHeading.evaluate(element => element.closest('.article-sources'))).toBeNull();
});

test('reader can identify C lessons in listings and navigate from Intro to Lesson 1', async ({ page }) => {
  for (const path of ['/writing/', '/writing/tag/c_language/']) {
    await page.goto(path);
    await expect(page.getByText('C course · 0 — Intro', { exact: true })).toBeVisible();
    await expect(page.getByText('C course · 1 — Lesson 1', { exact: true })).toBeVisible();
  }
  await page.goto('/writing/lets_learn_c_no-ai_0/');
  await expect(page.getByText('C course · 0 — Intro', { exact: true })).toBeVisible();
  const nav = page.getByRole('navigation', { name: 'C course lessons', exact: true });
  await expect(nav.getByRole('link')).toHaveText(['0 — Intro', '1 — Lesson 1']);
  await expect(nav.getByRole('link', { name: '0 — Intro', exact: true })).toHaveAttribute('aria-current', 'page');
  const next = nav.getByRole('link', { name: '1 — Lesson 1', exact: true });
  await page.keyboard.press('Tab');
  await next.focus();
  await expect(next).not.toHaveCSS('outline-style', 'none');
  await next.press('Enter');
  await expect(page).toHaveURL(/\/writing\/lets_learn_c_no-ai_1\/?$/);
  await expect(page.getByText('C course · 1 — Lesson 1', { exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: '1 — Lesson 1', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(nav.locator('[aria-current]')).toHaveCount(1);
  const exercise = page.getByRole('region', { name: 'Exercise: 1 — Make Hello World your own', exact: true });
  await expect(exercise).toBeVisible();
  await expect(exercise.getByRole('listitem')).toHaveCount(4);
});

test('course navigation sorts numbers, excludes drafts and other courses, and is absent on ordinary articles', async ({ page, request }) => {
  await page.goto('/writing/course-two/');
  const nav = page.getByRole('navigation', { name: 'Fixture course lessons', exact: true });
  await expect(nav.getByRole('link')).toHaveText(['2 — Lesson 2', '10 — Lesson 10']);
  await expect(nav.locator('[aria-current]')).toHaveText('2 — Lesson 2');
  await nav.getByRole('link', { name: '10 — Lesson 10', exact: true }).click();
  await expect(page).toHaveURL(/\/writing\/course-ten\/?$/);
  await expect(nav.locator('[aria-current]')).toHaveText('10 — Lesson 10');
  expect((await request.get('/writing/course-draft/')).status()).toBe(404);
  expect((await request.get('/writing/c-draft/')).status()).toBe(404);
  await page.goto('/writing/without-summary/');
  await expect(page.getByRole('navigation', { name: /lessons$/ })).toHaveCount(0);
});
