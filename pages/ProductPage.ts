/**
 * Страница товара (product details page)
 * Содержит селекторы и методы для взаимодействия с элементами страницы товара
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '@pages/BasePage';
import { parsePrice } from '@utils/price';

export class ProductPage extends BasePage {
  /** Поле ввода количества товара */
  readonly quantityInput: Locator;
  /** Кнопка добавления товара в корзину */
  readonly addToCartButton: Locator;
  /** Блок с ценами товара (обычная и со скидкой) */
  readonly priceWrapper: Locator;
  /** Выпадающий список для выбора размера (если доступен) */
  readonly sizeSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.quantityInput = page.locator('input[name="quantity"]');
    this.addToCartButton = page.locator('button[name="add_cart_product"]');
    this.priceWrapper = page.locator('#box-product .price-wrapper');
    this.sizeSelect = page.locator('select[name="options[Size]"]');
  }

  /**
   * Устанавливает количество товара
   * @param qty - количество товара для добавления в корзину
   */
  async setQuantity(qty: number): Promise<void> {
    await this.quantityInput.fill(String(qty));
  }

  /**
   * Добавляет текущий товар в корзину
   */
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  /**
   * Выбирает размер товара из выпадающего списка
   * @param size - размер товара (например, 'Small', 'Medium', 'Large')
   */
  async selectSize(size: string): Promise<void> {
    await this.sizeSelect.selectOption(size);
  }

  /**
   * Получает цену одного товара
   * Сначала проверяет наличие цены со скидкой, если нет - берет обычную цену
   * @returns цена одного товара как число
   */
  async getUnitPrice(): Promise<number> {
    const campaignDiscountPrice = this.priceWrapper.locator('.campaign-price');
    if (await campaignDiscountPrice.count()) {
      const priceText = await campaignDiscountPrice.textContent();
      return parsePrice(priceText);
    }
    const regularPrice = this.priceWrapper.locator('.price, .regular-price, .price:not(.campaign-price)');
    const priceText = await regularPrice.textContent();
    return parsePrice(priceText);
  }

  /**
   * Проверяет, что цена со скидкой видна на странице
   * Полезно для тестов товаров со скидкой
   */
  async expectCampaignPriceVisible(): Promise<void> {
    await expect(this.priceWrapper.locator('.campaign-price')).toBeVisible();
  }
}
