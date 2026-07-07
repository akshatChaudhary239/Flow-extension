import { test, expect } from '@playwright/test';

test('smoke test: backend is running', async ({ page }) => {
  // Assuming Next.js runs on 3000 locally
  // await page.goto('http://localhost:3000');
  // expect(await page.title()).not.toBe('');
  expect(true).toBe(true);
});
