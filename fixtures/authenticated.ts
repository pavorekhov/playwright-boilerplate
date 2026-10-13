/**
 * Фикстуры для авторизованных пользователей
 * Предоставляют доступ к странице после логина и связанным page objects
 */
import { test as base, Page } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage';
import { ProductPage } from '@pages/ProductPage';
import { CartPage } from '@pages/CartPage';

interface AuthFixtures {
  /** Страница после успешного логина (контекст браузера с авторизованным пользователем) */
  authenticatedPage: Page;
  /** Главная страница магазина */
  homePage: HomePage;
  /** Страница товара */
  productPage: ProductPage;
  /** Страница корзины */
  cartPage: CartPage;
}

export const test = base.extend<AuthFixtures>({
  /**
   * Создает новый контекст браузера и выполняет логин как пользователь
   * Использует учетные данные из переменных окружения
   */
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.loginAsUser();
    await loginPage.expectLoginSuccess();
    await use(page);
  },
  /**
   * Главная страница магазина на основе авторизованного контекста
   */
  homePage: async ({ authenticatedPage }, use) => {
    await use(new HomePage(authenticatedPage));
  },
  /**
   * Страница товара на основе авторизованного контекста
   */
  productPage: async ({ authenticatedPage }, use) => {
    await use(new ProductPage(authenticatedPage));
  },
  /**
   * Страница корзины на основе авторизованного контекста
   */
  cartPage: async ({ authenticatedPage }, use) => {
    await use(new CartPage(authenticatedPage));
  },
});

export { expect } from '@playwright/test';
