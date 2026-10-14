import { expect, test } from '@playwright/test';

test('Lesson 2 presents its floating-point clarification between the output and formatting explanation', async ({ page }) => {
  await page.goto('/writing/lets_learn_c_no_ai_2/');
  const note = page.getByRole('region', { name: 'Clarification: Floating-point precision', exact: true });
  await expect(note).toBeVisible();
  await expect(note).toContainText('To be noted: floating-point values are still approximations. Printing six decimal places does not guarantee six accurate decimal places, and printing fewer places does not change the stored result.');
  const icon = note.locator('svg');
  await expect(icon).toBeVisible();
  await expect(icon).toHaveAttribute('aria-hidden', 'true');
  await expect(icon).toHaveAttribute('focusable', 'false');
  const output = page.locator('pre').filter({ hasText: '300.000000\t148.888885' });
  const explanation = page.getByText(/^I am a picky programmer, and all those zeroes/);
  const outputBox = await output.boundingBox();
  const noteBox = await note.boundingBox();
  const explanationBox = await explanation.boundingBox();
  expect(noteBox!.y).toBeGreaterThanOrEqual(outputBox!.y + outputBox!.height);
  expect(explanationBox!.y).toBeGreaterThanOrEqual(noteBox!.y + noteBox!.height);
});
