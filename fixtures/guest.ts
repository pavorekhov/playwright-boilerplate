/**
 * Фикстуры для гостевых пользователей (не авторизованных)
 * Предоставляют доступ к страницам без необходимости логина
 */
import { test as base } from '@playwright/test';
import { HomePage } from '@pages/HomePage';
import { ProductPage } from '@pages/ProductPage';
import { CartPage } from '@pages/CartPage';

interface GuestFixtures {
  /** Главная страница магазина в гостевом режиме */
  homePage: HomePage;
  /** Страница товара в гостевом режиме */
  productPage: ProductPage;
  /** Страница корзины в гостевом режиме */
  cartPage: CartPage;
}

export const test = base.extend<GuestFixtures>({
  /**
   * Главная страница магазина
   * Автоматически создается для каждого теста в гостевом режиме
   */
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  /**
   * Страница товара
   * Автоматически создается для каждого теста в гостевом режиме
   */
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  /**
   * Страница корзины
   * Автоматически создается для каждого теста в гостевом режиме
   */
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';
