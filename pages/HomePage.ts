import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly productItems: Locator;
  readonly recentlyViewedProducts: Locator;
  readonly cartQuantity: Locator;
  readonly cartTotalValue: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // список карточек товаров на главной странице
    this.productItems = page.locator('ul.products li.product');
    // список недавно просмотренных товаров
    this.recentlyViewedProducts = page.locator('#box-recently-viewed-products li');
    // количество товаров в корзине
    this.cartQuantity = page.locator('#cart .quantity');
    this.cartTotalValue = page.locator('#cart .formatted_value');
    //ссылка на корзину
    this.cartLink = page.getByRole('link', { name: /^Cart:/ });
  }

  async open() {
    await this.page.goto('');
  }

  // найти карточку товара по видимому имени (точное совпадение)
  getProductByName(name: string): Locator {
    return this.productItems.filter({ has: this.page.locator('.name', { hasText: name }) });
  }

  async openProduct(name: string) {
    const product = this.getProductByName(name);
    await product.locator('a.link').first().click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async expectCartIsEmpty() {
    await expect(this.cartQuantity).toHaveText('0');
  }

  // найти товар в блоке Recently Viewed по имени
  getRecentlyViewedProduct(productName: string): Locator {
    // преобразуем имя в URL-формат (slug)
    const slug = productName.toLowerCase().replaceAll(' ', '-');
    return this.recentlyViewedProducts.filter({ has: this.page.locator(`a[href*="${slug}"]`) });
  }
}
