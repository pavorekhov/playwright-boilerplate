/**
 * Страница корзины и оформления заказа
 * Содержит селекторы и методы для взаимодействия с элементами корзины и формы оформления заказа
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '@pages/BasePage';
import { parsePrice } from '@utils/price';

export class CartPage extends BasePage {
  /** Строки с товарами в таблице подтверждения заказа Order Summary */
  readonly itemRows: Locator;
  /** Кнопка подтверждения заказа */
  readonly confirmOrderButton: Locator;
  /** Список товаров в корзине (наверху на странице корзины) */
  readonly cartItems: Locator;

  // Поля в форме оформления заказа
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
    super(page);
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

  /**
   * Ожидает загрузки таблицы с товарами в корзине
   * Ждет, пока первая строка товара станет видимой
   */
  async waitForLoad(): Promise<void> {
    await expect(this.itemRows.first()).toBeVisible();
  }

  /**
   * Находит строку с указанным товаром в таблице подтверждения заказа
   * @param productName - название товара
   * @returns Locator строки с товаром
   */
  private getProductRow(productName: string): Locator {
    return this.itemRows.filter({ has: this.page.locator('td.item', { hasText: productName }) });
  }

  /**
   * Получает количество указанного товара в корзине
   * @param productName - название товара
   * @returns количество товара как строка
   */
  async getQuantityForProduct(productName: string): Promise<string> {
    const row = this.getProductRow(productName);
    return (await row.locator('td:nth-child(1)').textContent()) ?? '';
  }

  /**
   * Получает цену за единицу указанного товара в корзине
   * @param productName - название товара
   * @returns цена за единицу как число
   */
  async getUnitPriceForProduct(productName: string): Promise<number> {
    const row = this.getProductRow(productName);
    const text = await row.locator('td.unit-cost').textContent();
    return parsePrice(text);
  }

  /**
   * Получает общую стоимость указанного товара в корзине (цена за единицу * количество)
   * @param productName - название товара
   * @returns общая стоимость как число
   */
  async getTotalForProduct(productName: string): Promise<number> {
    const row = this.getProductRow(productName);
    const text = await row.locator('td.sum').textContent();
    return parsePrice(text);
  }

  /**
   * Подтверждает заказ (нажимает кнопку Confirm Order)
   * После нажатия ожидает загрузки DOM
   */
  async confirmOrder(): Promise<void> {
    await this.confirmOrderButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Проверяет успешное оформление заказа
   * Ожидает, что текущий URL содержит '/order_success' и видно сообщение об успехе
   */
  async expectOrderSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/\/order_success$/);
    await expect(this.page.getByText(/Your order is successfully completed!/i)).toBeVisible();
  }

  /**
   * Проверяет, что все поля адреса покупателя в форме оформления заказа пустые
   * Используется для проверки гостевого режима
   */
  async expectBillingAddressIsEmpty(): Promise<void> {
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

  /**
   * Очищает корзину, удаляя все товары по одному
   * После каждого удаления проверяет, что количество товаров уменьшилось на 1
   */
  async clearCart(): Promise<void> {
    while (await this.cartItems.count() > 0) {
      const itemsBefore = await this.cartItems.count();
      await this.cartItems.first().getByRole('button', { name: 'Remove' }).click();
      await expect(this.cartItems).toHaveCount(itemsBefore - 1);
    }
  }
}
