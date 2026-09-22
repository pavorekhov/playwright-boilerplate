import { Page, Locator, expect } from '@playwright/test';
import { parsePrice } from '../utils/price';

export class CartPage {
  readonly page: Page;
  readonly itemRows: Locator;
  readonly confirmOrderButton: Locator;
  readonly cartItems: Locator;

  //поля в форме оформления заказа
  readonly taxIdInput: Locator;
  readonly companyInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly postcodeInput: Locator;
  readonly cityInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;

  constructor(page: Page) {
    this.page = page;
    // строки с айтемами в таблице Order Confirmation
    this.itemRows = page.locator('#order_confirmation-wrapper .dataTable tr:has(td.item)');
    this.confirmOrderButton = page.getByRole('button', { name: /Confirm Order/i });
    this.cartItems = page.locator('#checkout-cart-wrapper ul.items li.item');

    this.taxIdInput = page.locator('input[name="tax_id"]');
    this.companyInput = page.locator('input[name="company"]');
    this.firstNameInput = page.locator('input[name="firstname"]');
    this.lastNameInput = page.locator('input[name="lastname"]');
    this.address1Input = page.locator('input[name="address1"]');
    this.address2Input = page.locator('input[name="address2"]');
    this.postcodeInput = page.locator('input[name="postcode"]');
    this.cityInput = page.locator('input[name="city"]');
    this.emailInput = page.locator('input[name="email"]');
    this.phoneInput = page.locator('input[name="phone"]');
  }

  async waitForLoad() {
    await expect(this.itemRows.first()).toBeVisible();
  }

  async getQuantityForProduct(productName: string): Promise<string> {
    const row = this.itemRows.filter({ has: this.page.locator('td.item', { hasText: productName }) });
    return (await row.locator('td:nth-child(1)').textContent()) ?? '';
  }

  async getUnitPriceForProduct(productName: string): Promise<number> {
    const row = this.itemRows.filter({ has: this.page.locator('td.item', { hasText: productName }) });
    const text = await row.locator('td.unit-cost').textContent();
    return parsePrice(text);
  }

  async getTotalForProduct(productName: string): Promise<number> {
    const row = this.itemRows.filter({ has: this.page.locator('td.item', { hasText: productName }) });
    const text = await row.locator('td.sum').textContent();
    return parsePrice(text);
  }

  async confirmOrder() {
    await this.confirmOrderButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectOrderSuccess() {
    await expect(this.page).toHaveURL(/\/order_success$/);
    await expect(this.page.getByText(/Your order is successfully completed!/i)).toBeVisible();
  }

  async expectBillingAddressIsEmpty() {
    await expect(this.taxIdInput).toHaveValue('');
    await expect(this.companyInput).toHaveValue('');
    await expect(this.firstNameInput).toHaveValue('');
    await expect(this.lastNameInput).toHaveValue('');
    await expect(this.address1Input).toHaveValue('');
    await expect(this.address2Input).toHaveValue('');
    await expect(this.postcodeInput).toHaveValue('');
    await expect(this.cityInput).toHaveValue('');
    await expect(this.emailInput).toHaveValue('');
    await expect(this.phoneInput).toHaveValue('');
  }

  async clearCart() {
    while (await this.cartItems.count() > 0) {
      const itemsBefore = await this.cartItems.count();
      await this.cartItems.first().getByRole('button', { name: 'Remove' }).click();
      await expect(this.cartItems).toHaveCount(itemsBefore - 1);
    }
  }
}
