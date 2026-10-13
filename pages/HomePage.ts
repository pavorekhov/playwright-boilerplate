/**
 * Главная страница магазина
 * Содержит селекторы и методы для взаимодействия с элементами главной страницы
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class HomePage extends BasePage {
  /** Список карточек товаров на главной странице */
  readonly productItems: Locator;
  /** Список недавно просмотренных товаров */
  readonly recentlyViewedProducts: Locator;
  /** Количество товаров в корзине (отображается в шапке) */
  readonly cartQuantity: Locator;
  /** Общая стоимость товаров в корзине (отображается в шапке) */
  readonly cartTotalValue: Locator;
  /** Ссылка на корзину */
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    // список карточек товаров на главной странице
    this.productItems = page.locator('ul.products li.product');
    // список недавно просмотренных товаров
    this.recentlyViewedProducts = page.locator('#box-recently-viewed-products li');
    // количество товаров в корзине
    this.cartQuantity = page.locator('#cart .quantity');
    // общая стоимость товаров в корзине
    this.cartTotalValue = page.locator('#cart .formatted_value');
    //ссылка на корзину
    this.cartLink = page.getByRole('link', { name: /^Cart:/ });
  }

  /**
   * Открывает главную страницу магазина
   */
  async open(): Promise<void> {
    await super.open();
  }

  /**
   * Находит карточку товара по видимому имени (точное совпадение)
   * @param name - название товара
   * @returns Locator карточки товара
   */
  getProductByName(name: string): Locator {
    return this.productItems.filter({ has: this.page.locator('.name', { hasText: name }) });
  }

  /**
   * Открывает страницу товара по его названию
   * @param name - название товара
   */
  async openProduct(name: string): Promise<void> {
    const product = this.getProductByName(name);
    await product.locator('a.link').first().click();
  }

  /**
   * Переходит в корзину
   */
  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  /**
   * Проверяет, что корзина пуста (количество товаров равно нулю)
   */
  async expectCartIsEmpty(): Promise<void> {
    await expect(this.cartQuantity).toHaveText('0');
  }

  /**
   * Находит товар в блоке Recently Viewed по имени
   * @param productName - название товара
   * @returns Locator товара в блоке Recently Viewed
   */
  getRecentlyViewedProduct(productName: string): Locator {
    // преобразуем имя в URL-формат (slug)
    const slug = productName.toLowerCase().replaceAll(' ', '-');
    return this.recentlyViewedProducts.filter({ has: this.page.locator(`a[href*="${slug}"]`) });
  }
}
