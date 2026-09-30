import { expect, test } from '@playwright/test';

test('title-case navigation preserves destinations and current-page state across public routes', async ({ page }) => {
  const links = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Writing', href: '/writing' },
  ];

  for (const route of [
    { path: '/', current: 'Home' },
    { path: '/about/', current: 'About' },
    { path: '/writing/', current: 'Writing' },
    { path: '/writing/aoc-16_0/', current: 'Writing' },
    { path: '/writing/tag/aoc/', current: 'Writing' },
  ]) {
    await page.goto(route.path);
    const navigation = page.getByRole('navigation');

    for (const { name, href } of links) {
      const link = navigation.getByRole('link', { name, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveText(name);
      await expect(link).toHaveAttribute('href', href);
      if (name === route.current) {
        await expect(link).toHaveAttribute('aria-current', 'page');
        await expect(link).toHaveClass(/\bactive\b/);
      } else {
        await expect(link).not.toHaveAttribute('aria-current');
        await expect(link).not.toHaveClass(/\bactive\b/);
      }
    }
  }

  for (const { name, href } of links) {
    await page.getByRole('navigation').getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(new URL(href, page.url()).href);
    await expect(page.getByRole('navigation').getByRole('link', { name, exact: true }))
      .toHaveAttribute('aria-current', 'page');
  }
});
