/**
 * Фикстуры, предоставляющие все page objects сразу
 * Используется когда тесту нужны доступ ко всем страницам
 */
import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage';
import { ProductPage } from '@pages/ProductPage';
import { CartPage } from '@pages/CartPage';

interface PageObjects {
  loginPage: LoginPage;
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
}

export const test = base.extend<PageObjects>({
  /**
   * Страница логина
   * Автоматически создается для каждого теста
   */
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  /**
   * Главная страница магазина
   * Автоматически создается для каждого теста
   */
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  /**
   * Страница товара
   * Автоматически создается для каждого теста
   */
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  /**
   * Страница корзины
   * Автоматически создается для каждого теста
   */
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';
