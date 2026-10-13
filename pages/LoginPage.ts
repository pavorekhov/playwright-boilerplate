/**
 * Страница логина в приложении
 * Содержит селекторы и методы для взаимодействия с формой авторизации
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '@pages/BasePage';
import { requireEnv } from '@config/env';

export class LoginPage extends BasePage {
  /** Поле ввода email */
  readonly emailInput: Locator;
  /** Поле ввода пароля */
  readonly passwordInput: Locator;
  /** Кнопка входа */
  readonly loginButton: Locator;
  /** Блок с сообщением об ошибке */
  readonly errorMessage: Locator;
  /** Ссылка на выход (появляется после успешного логина) */
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: /Login/i });
    this.errorMessage = page.locator('#notices .notice.errors');
    this.logoutLink = page.locator('#box-account').getByRole('link', { name: /Logout/i });
  }

  /**
   * Открывает страницу логина
   * Ждет, пока поле email станет видимым
   */
  async open(): Promise<void> {
    await super.open('login');
    await expect(this.emailInput).toBeVisible();
  }

  /**
   * Выполняет логин с указанными учетными данными
   * @param email - email пользователя
   * @param password - пароль пользователя
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Выполняет логин как пользователь
   * Использует учетные данные из переменных окружения
   */
  async loginAsUser(): Promise<void> {
    await this.login(requireEnv('login'), requireEnv('password'));
  }

  /**
   * Проверяет успешный логин
   * Ожидает, что текущий URL совпадает с базовым и видна ссылка на выход
   */
  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(requireEnv('baseUrl'));
    await expect(this.logoutLink).toBeVisible();
  }

  /**
   * Проверяет неуспешный логин по наличию сообщения об ошибке
   * @param messagePattern - регулярное выражение для текста ошибки (по умолчанию стандартное сообщение)
   */
  async expectLoginFailed(messagePattern: RegExp = /Wrong password or the account is disabled, or does not exist/i): Promise<void> {
    await expect(this.errorMessage).toContainText(messagePattern);
  }
}
