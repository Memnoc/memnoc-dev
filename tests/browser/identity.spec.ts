import { expect, test } from '@playwright/test';

test('visitor sees the canonical role on Home and About', async ({ page }) => {
  for (const path of ['/', '/about/']) {
    await page.goto(path);

    await expect(page.getByText('Sr. Software Engineer', { exact: true })).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Sr\. Software Engineer/,
    );
  }
});

test('visitor sees AI-assisted connector development as the professional specialty', async ({ page }) => {
  for (const path of ['/', '/about/']) {
    await page.goto(path);

    await expect(page.locator('main')).toContainText(
      'Professionally, I use AI to help build connectors between software systems.',
    );
  }
});

test('visitor sees the primary personal technical direction on Home and About', async ({ page }) => {
  for (const path of ['/', '/about/']) {
    await page.goto(path);

    const pageContent = page.locator('main');
    await expect(pageContent).toContainText('systems software in C and Rust');
    await expect(pageContent).toContainText('distributed systems');
    await expect(pageContent).toContainText('compilers');
    await expect(pageContent).toContainText('low-level tools');
  }
});

test('visitor sees Applied AI framed as study and future writing', async ({ page }) => {
  for (const path of ['/', '/about/']) {
    await page.goto(path);

    const pageContent = page.locator('main');
    await expect(pageContent).toContainText(
      'I also study applied AI systems',
    );
    await expect(pageContent).toContainText('write about what I learn');
    if (path === '/') {
      await expect(pageContent).toContainText('Computational Linguistics and Natural Language Processing');
    }
    await expect(pageContent).not.toContainText(/AI researcher|AI research role/i);
  }
});

test('visitor sees labotteghina.gallery as the sole art destination', async ({ page }) => {
  for (const path of ['/', '/about/']) {
    await page.goto(path);

    await expect(
      page.locator('a[href="https://labotteghina.gallery"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('a[href*="artstation.com"], a[href*="labotteghina.art"]'),
    ).toHaveCount(0);
  }
});
