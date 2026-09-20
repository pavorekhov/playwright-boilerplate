import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly priceWrapper: Locator;
  readonly sizeSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.quantityInput = page.locator('input[name="quantity"]');
    this.addToCartButton = page.locator('button[name="add_cart_product"]');
    this.priceWrapper = page.locator('#box-product .price-wrapper');
    this.sizeSelect = page.locator('select[name="options[Size]"]');
  }

  async setQuantity(qty: number) {
    await this.quantityInput.fill(String(qty));
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async selectSize(size: string) {
    await this.sizeSelect.selectOption(size);
  }

  // получить цену одного товара
  async getUnitPrice(): Promise<number> {
    const campaignDiscountPrice = this.priceWrapper.locator('.campaign-price');
    if (await campaignDiscountPrice.count()) {
      const priceText = await campaignDiscountPrice.textContent();
      return this.parsePrice(priceText);
    }
    const regularPrice = this.priceWrapper.locator('.price, .regular-price, .price:not(.campaign-price)');
    const priceText = await regularPrice.textContent();
    return this.parsePrice(priceText);
  }

  private parsePrice(text: string | null): number {
    if (!text) return 0;
    const match = text.match(/\d+(?:[.,]\d+)?/);
    return match ? parseFloat(match[0].replace(',', '.')) : 0;
  }
}
