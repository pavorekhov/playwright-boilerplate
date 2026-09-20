// tests/ui/test-case-3.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

// Тест-кейс 3: Заказ товара без логина и проверка "Recently Viewed".

test.describe('TC3: Гостевая покупка двух товаров и проверка Recently Viewed', () => {
  test('Гостевая покупка двух товаров и проверка Recently Viewed', async ({ page }) => {
    const home = new HomePage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);

    const productName1 = 'Blue Duck';
    const productName2 = 'Yellow Duck';
    const size = 'Small';
    const quantity = 1;

    // Выбор и добавление первого товара
    let expectedUnitPrice1 = 0;
    let expectedUnitPrice2 = 0;
    await test.step('Добавление первого товара (Blue Duck)', async () => {
      await home.open();
      await home.openProduct(productName1);
      expectedUnitPrice1 = await product.getUnitPrice();
      await product.setQuantity(quantity);
      await product.addToCart();
      await expect(home.cartQuantity).toHaveText('1');
    });

    // Выбор и добавление второго товара, сумма посчитана верно
    await test.step('Добавление второго товара (Yellow Duck)', async () => {
      await home.open();
      await home.openProduct(productName2);
      expectedUnitPrice2 = await product.getUnitPrice();
      await product.setQuantity(quantity);
      await product.selectSize(size);
      await product.addToCart();
      await expect(home.cartQuantity).toHaveText(String(quantity * 2));
      await expect(home.cartTotalValue).toHaveText('$38');
    });

    // Проверка корзины с двумя товарами
    await test.step('Проверка корзины с двумя товарами', async () => {
      await home.goToCart();
      await cart.waitForLoad();
      await expect(cart.itemRows).toHaveCount(2);

      // product1 = Blue Duck
      const qty1 = await cart.getQuantityForProduct(productName1);
      const unit1 = await cart.getUnitPriceForProduct(productName1);
      const total1 = await cart.getTotalForProduct(productName1);
      const expectedTotal1 = expectedUnitPrice1 * quantity;

      await expect(qty1).toBe(String(quantity));
      await expect(unit1).toBe(expectedUnitPrice1);
      await expect(total1).toBe(expectedTotal1);

      // product2 = Yellow Duck
      const qty2 = await cart.getQuantityForProduct(productName2);
      const unit2 = await cart.getUnitPriceForProduct(productName2);
      const total2 = await cart.getTotalForProduct(productName2);
      const expectedTotal2 = expectedUnitPrice2 * quantity;

      await expect(qty2).toBe(String(quantity));
      await expect(unit2).toBe(expectedUnitPrice2);
      await expect(total2).toBe(expectedTotal2);

      // Общая сумма с двумя товарами
      const expectedOrderTotal = expectedTotal1 + expectedTotal2;
      const actualOrderTotal = total1 + total2;
      await expect(actualOrderTotal).toBe(expectedOrderTotal);
    });

    // Проверка, что данные по пользователю пустые
    await test.step('Проверка пустых данных по пользователю', async () => {
      await cart.expectBillingAddressIsEmpty();
    });

    // Проверка Recently Viewed
    await test.step('Проверка блока Recently Viewed', async () => {
      await home.open();
      const recentlyViewed = home.recentlyViewedProducts;
      await expect(recentlyViewed).toHaveCount(2);
      await expect(home.getRecentlyViewedProduct(productName1)).toBeVisible();
      await expect(home.getRecentlyViewedProduct(productName2)).toBeVisible();
    });
  });
});
