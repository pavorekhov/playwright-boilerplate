/**
 * TC1: Заказ одного товара без скидки
 *
 * Тест-кейс проверяет процесс оформления заказа авторизованным пользователем
 * для товара без скидки (Blue Duck).
 *
 * Шаги теста:
 * 1. Авторизация пользователя
 * 2. Очистка корзины
 * 3. Выбор товара без скидки
 * 4. Добавление товара в корзину с указанием количества
 * 5. Проверка корзины (количество, цена за единицу, общая цена)
 * 6. Оформление заказа и проверка успеха
 */
import { test, expect } from '@fixtures/authenticated';
import { PRODUCTS, QUANTITIES } from '@data/products';
import { calculateTotal } from '@utils/price';

test.describe('TC1: Заказ одного товара без скидки', () => {
  test('Заказ одного товара без скидки', async ({ homePage, productPage, cartPage }) => {
    // Тестовые данные
    const product = PRODUCTS.blueDuck;
    const quantity = QUANTITIES.three;

    await test.step('Очистка корзины', async () => {
      // Переходим в корзину и очищаем её перед началом теста
      await homePage.open();
      await homePage.goToCart();
      await cartPage.clearCart();
    });

    await test.step('Выбор товара без скидки', async () => {
      // Возвращаемся на главную страницу и проверяем, что корзина пуста
      await homePage.open();
      await homePage.expectCartIsEmpty();
      // Открываем страницу выбранного товара
      await homePage.openProduct(product.name);
    });

    let expectedUnitPrice = 0;
    await test.step('Добавление товара в корзину', async () => {
      // Получаем цену товара (без скидки, так как скидки нет)
      expectedUnitPrice = await productPage.getUnitPrice();
      // Устанавливаем количество и добавляем в корзину
      await productPage.setQuantity(quantity);
      await productPage.addToCart();
      // Проверяем, что количество в корзине обновилось
      await expect(homePage.cartQuantity).toHaveText(String(quantity));
    });

    await test.step('Проверка корзины', async () => {
      // Переходим в корзину для проверки деталей заказа
      await homePage.goToCart();
      await cartPage.waitForLoad();
      // Проверяем, что в корзине ровно одна строка с товаром
      await expect(cartPage.itemRows).toHaveCount(1);

      // Получаем данные о товаре из корзины и проверяем их
      const qty = await cartPage.getQuantityForProduct(product.name);
      await expect(qty).toBe(String(quantity));

      const unit = await cartPage.getUnitPriceForProduct(product.name);
      const total = await cartPage.getTotalForProduct(product.name);
      const expectedTotal = calculateTotal(expectedUnitPrice, quantity);

      // Проверяем, что цена за единицу и общая цена совпадают с ожидаемыми
      await expect(unit).toBe(expectedUnitPrice);
      await expect(total).toBe(expectedTotal);
    });

    await test.step('Подтверждение заказа', async () => {
      // Оформляем заказ и проверяем успех
      await cartPage.confirmOrder();
      await cartPage.expectOrderSuccess();
    });
  });
});
