import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginUrlLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: /Login/i });
    this.errorMessage = page.locator('#notices .notice.errors');
    this.loginUrlLink = page.locator('#box-account').getByRole('link', { name: /Logout/i });
  }

  async open() {
    await this.page.goto('login');
    await expect(this.emailInput).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoginSuccess() {
    await expect(this.page).toHaveURL(process.env.BASE_URL!);
    await expect(this.loginUrlLink).toBeVisible();
  }

  async expectLoginFailedWithErrorMessage() {
    await expect(this.errorMessage).toContainText(/Wrong password or the account is disabled, or does not exist/i);
  }
}
