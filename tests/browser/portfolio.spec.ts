import { expect, test } from '@playwright/test';

test('hiring manager sees evidence-bearing Built entries with distinct provenance', async ({ page }) => {
  await page.goto('/');

  const built = page.getByRole('region', { name: 'Built' });
  await expect(built.getByText(
    'Completed work whose public default branch carries source, a clean build, runnable proof, licensing, limitations, and provenance.',
  )).toBeVisible();

  const codeAtlas = built.getByRole('article', { name: 'CodeAtlas — Original' });
  await expect(codeAtlas.getByText('Original', { exact: true })).toBeVisible();
  await expect(codeAtlas.getByText(
    'Maps a repository into an interactive knowledge graph of files, symbols, imports, and calls.',
  )).toBeVisible();
  await expect(codeAtlas.getByText('Rust', { exact: true })).toBeVisible();
  await expect(codeAtlas.getByText('TypeScript', { exact: true })).toBeVisible();
  await expect(codeAtlas.getByText('Code intelligence', { exact: true })).toBeVisible();
  await expect(codeAtlas.getByRole('link', { name: 'View CodeAtlas source' })).toHaveAttribute(
    'href',
    'https://github.com/Memnoc/CodeAtlas',
  );

  const northstar = built.getByRole('article', {
    name: 'Northstar — Adapted and extended',
  });
  await expect(northstar.getByText('Adapted and extended', { exact: true })).toBeVisible();
  await expect(northstar.getByText(
    'Adapts Matt Pocock’s engineering skill system into a local-first workflow, adding decision records, test-first tickets, two-axis review, and guided specialist tools.',
  )).toBeVisible();
  await expect(northstar.getByText('Shell', { exact: true })).toBeVisible();
  await expect(northstar.getByText('Agent workflows', { exact: true })).toBeVisible();
  await expect(northstar.getByRole('link', { name: 'View Northstar source' })).toHaveAttribute(
    'href',
    'https://github.com/Memnoc/northstar',
  );
});

test('visitor sees StarScript separately as honest Current work', async ({ page }) => {
  await page.goto('/');

  const currentWork = page.getByRole('region', { name: 'Current work' });
  await expect(currentWork.getByText(
    'Work in progress, shown at its last publicly verified maturity and current availability.',
  )).toBeVisible();

  const starScript = currentWork.getByRole('article', {
    name: 'StarScript — Current work',
  });
  await expect(starScript.getByText('Current work', { exact: true })).toBeVisible();
  await expect(starScript.getByText(
    'At its last publicly verified stage, an early bytecode VM in C building a hand-built instruction chunk, following Crafting Interpreters as a learning path.',
  )).toBeVisible();
  const sourceLink = starScript.getByRole('link', { name: 'View StarScript source' });
  await expect(sourceLink).toHaveAttribute(
    'href',
    'https://github.com/Memnoc/StarScript',
  );
  await expect(starScript).not.toContainText('Source currently unavailable');

  await expect(starScript).not.toContainText(/parser|grammar|error recovery|shared AST/i);
  await expect(page.locator('main')).not.toContainText(
    /r_command_line|Build Your Own Lisp|\bBYOL\b|codecrafters-shell-rust|Rust shell/i,
  );
  await expect(page.locator('a[href="https://github.com/Memnoc/r_command_line"]')).toHaveCount(0);
  await expect(page.locator('a[href="https://github.com/Memnoc/BYOL"]')).toHaveCount(0);
  await expect(page.locator('a[href="https://github.com/Memnoc/codecrafters-shell-rust"]')).toHaveCount(0);

  await page.goto('/about/');
  await expect(page.getByText(/r_command_line|Build Your Own Lisp|BYOL|Rust shell/i)).toHaveCount(0);
});
