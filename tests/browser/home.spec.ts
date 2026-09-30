import { expect, test } from '@playwright/test';
import { readdirSync } from 'node:fs';

function robotsPatternMatchesPath(pattern: string, path: string) {
  const anchorsAtEnd = pattern.endsWith('$');
  const patternBody = anchorsAtEnd ? pattern.slice(0, -1) : pattern;
  const expression = patternBody
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replaceAll('*', '.*');

  return new RegExp(`^${expression}${anchorsAtEnd ? '$' : ''}`).test(path);
}

test('visitor can open the production-built home page', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { level: 1, name: /Matteo Stara/ }),
  ).toBeVisible();
});

test('crawler can observe the Public draft noindex directive', async ({ page, request }) => {
  const generatedPages = readdirSync('dist', { recursive: true })
    .filter((path): path is string => typeof path === 'string' && path.endsWith('index.html'))
    .map((path) => `/${path.replace(/index\.html$/, '')}`)
    .sort();

  for (const path of generatedPages) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, follow',
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      new URL(path, 'https://memnoc.dev').href,
    );
  }

  const robotsResponse = await request.get('/robots.txt');
  if (robotsResponse.ok()) {
    const disallowPatterns = (await robotsResponse.text())
      .split('\n')
      .flatMap((line) => {
        const directive = line
          .replace(/#.*/, '')
          .match(/^\s*Disallow\s*:\s*(.*?)\s*$/i);
        return directive?.[1] ? [directive[1]] : [];
      });

    for (const path of generatedPages) {
      expect(
        disallowPatterns.filter((pattern) => robotsPatternMatchesPath(pattern, path)),
        `robots.txt must not disallow generated page ${path}`,
      ).toEqual([]);
    }
  }
});

test('shared metadata identifies the actual page at its canonical URL', async ({ page }) => {
  await page.goto('/about/');

  const title = 'About — Matteo Stara (memnoc)';
  const description =
    'Matteo Stara (memnoc) — Sr. Software Engineer using AI to help build connectors between software systems.';
  const canonicalUrl = 'https://memnoc.dev/about/';

  await expect(page).toHaveTitle(title);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    description,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    canonicalUrl,
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    'content',
    'website',
  );
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    'content',
    'Matteo Stara (memnoc)',
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    title,
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    'content',
    description,
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    canonicalUrl,
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary',
  );
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    'content',
    title,
  );
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
    'content',
    description,
  );
});

test('initial theme follows the operating-system preference and exposes its state', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => {
    requestAnimationFrame(() => {
      (window as Window & { firstFrameTheme?: string | null }).firstFrameTheme =
        document.documentElement.getAttribute('data-theme');
    });
  });
  await page.goto('/');

  await expect.poll(() => page.evaluate(() => (
    window as Window & { firstFrameTheme?: string | null }
  ).firstFrameTheme)).toBe('moon');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'moon');
  await expect(page.getByRole('combobox', { name: 'Theme', exact: true })).toHaveValue('moon');
});

test('manual theme choice persists across navigation and reloads', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');

  const theme = page.getByRole('combobox', { name: 'Theme', exact: true });
  await expect(theme).toHaveValue('dawn');
  await theme.selectOption('moon');

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'moon');
  await expect(page.getByRole('combobox', { name: 'Theme', exact: true })).toHaveValue('moon');

  await page.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'moon');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'moon');
  await expect(page.getByRole('combobox', { name: 'Theme', exact: true })).toHaveValue('moon');
});

test('manual Dawn choice overrides a dark operating-system preference', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');

  await page.getByRole('combobox', { name: 'Theme', exact: true }).selectOption('dawn');

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dawn');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(250, 244, 237)');
  await expect(page.locator('html')).toHaveCSS('color', 'rgb(87, 82, 121)');

  await page.addInitScript(() => {
    requestAnimationFrame(() => {
      const root = document.documentElement;
      (window as Window & {
        firstFrameDawn?: { theme: string | null; background: string };
      }).firstFrameDawn = {
        theme: root.getAttribute('data-theme'),
        background: getComputedStyle(root).backgroundColor,
      };
    });
  });
  await page.reload();
  await expect.poll(() => page.evaluate(() => (
    window as Window & {
      firstFrameDawn?: { theme: string | null; background: string };
    }
  ).firstFrameDawn)).toEqual({
    theme: 'dawn',
    background: 'rgb(250, 244, 237)',
  });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dawn');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(250, 244, 237)');
});

test('saved Rosé Pine overrides the system theme before the first paint', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => {
    localStorage.setItem('rp-theme', 'rose-pine');
    requestAnimationFrame(() => {
      const root = document.documentElement;
      (window as Window & {
        firstFrameRosePine?: { theme: string | null; background: string };
      }).firstFrameRosePine = {
        theme: root.getAttribute('data-theme'),
        background: getComputedStyle(root).backgroundColor,
      };
    });
  });
  await page.goto('/writing/aoc-16_0/');

  await expect.poll(() => page.evaluate(() => (
    window as Window & {
      firstFrameRosePine?: { theme: string | null; background: string };
    }
  ).firstFrameRosePine)).toEqual({
    theme: 'rose-pine',
    background: 'rgb(25, 23, 36)',
  });
  await expect(page.locator('html')).toHaveCSS('color', 'rgb(224, 222, 244)');
});

test('visitor can choose Rosé Pine and keep it across article navigation and reloads', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const theme = page.getByRole('combobox', { name: 'Theme', exact: true });
  await expect(theme).toHaveValue('dawn');
  await theme.selectOption({ label: 'Rosé Pine' });
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(25, 23, 36)');

  await page.getByRole('navigation').getByRole('link', { name: 'Writing', exact: true }).click();
  await page.getByRole('link', { name: 'Get your brain to the gym!', exact: true }).click();
  await expect(theme).toHaveValue('rose-pine');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(25, 23, 36)');
  await page.reload();
  await expect(theme).toHaveValue('rose-pine');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(25, 23, 36)');
});

test('keyboard user can select every theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const theme = page.getByRole('combobox', { name: 'Theme', exact: true });
  await theme.focus();
  await theme.press('Home');
  await theme.press('Enter');
  await expect(theme).toHaveValue('rose-pine');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(25, 23, 36)');
  await theme.press('ArrowDown');
  await theme.press('Enter');
  await expect(theme).toHaveValue('moon');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(35, 33, 54)');
  await theme.press('End');
  await theme.press('Enter');
  await expect(theme).toHaveValue('dawn');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(250, 244, 237)');
});
