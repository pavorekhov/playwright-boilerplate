// tests/ui/test-case-2.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

// Тест-кейс 2: заказ одного товара со скидкой.
test.describe('TC2: Заказ товара со скидкой', () => {
  test('Заказ товара со скидкой', async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);

    const productName = 'Yellow Duck';
    const size = 'Small';
    const quantity = 2;

    // Предусловие
    await test.step('Проверка пустой корзины', async () => {
      await home.open();
      await home.expectCartIsEmpty();
    });

    // Логин
    await test.step('Логин', async () => {
      await login.open();
      await login.login(process.env.LOGIN!, process.env.PASSWORD!);
      await login.expectLoginSuccess();
    });

    // Выбор товара со скидкой
    await test.step('Выбор товара со скидкой', async () => {
      await home.openProduct(productName);
    });

    // Добавление товара в корзину
    let expectedUnitPrice = 0;
    await test.step('Добавление товара в корзину', async () => {
      // Удостоверяемся, что отображается цена со скидкой
      await expect(product.priceWrapper.locator('.campaign-price')).toBeVisible();
      expectedUnitPrice = await product.getUnitPrice();
      await product.setQuantity(quantity);
      await product.selectSize(size);
      await product.addToCart();
      await expect(home.cartQuantity).toHaveText(String(quantity));
    });

    // Проверка корзины
    await test.step('Проверка корзины', async () => {
      await home.goToCart();
      await cart.waitForLoad();
      await expect(cart.itemRows).toHaveCount(1);
      const qty = await cart.getQuantityForProduct(productName);
      await expect(qty).toBe(String(quantity));
      const unit = await cart.getUnitPriceForProduct(productName);
      const total = await cart.getTotalForProduct(productName);
      const expectedTotal = expectedUnitPrice * quantity;
      await expect(unit).toBe(expectedUnitPrice);
      await expect(total).toBe(expectedTotal);
    });

    // Оформление заказа
    await test.step('Подтверждение заказа', async () => {
      await cart.confirmOrder();
      await cart.expectOrderSuccess();
    });
  });
});
