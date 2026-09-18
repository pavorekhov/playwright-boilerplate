import { test, expect } from '@playwright/test';

test('Check Playwright page title', async ({ page }) => {
  await test.step('Открыть главную страницу Playwright', async () => {
    await page.goto('https://playwright.dev/');
  });

  await test.step('Проверить заголовок страницы', async () => {
    await expect(page).toHaveTitle(/Playwright/);
  });
});

test('Open Get Started page', async ({ page }) => {
  await test.step('Открыть главную страницу Playwright', async () => {
    await page.goto('https://playwright.dev/');
  });

  await test.step('Нажать на ссылку "Get started"', async () => {
    await page.getByRole('link', { name: 'Get started' }).click();
  });

  await test.step('Проверить заголовок "Installation"', async () => {
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });
});
