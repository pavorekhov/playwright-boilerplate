/**
 * TC2: Заказ одного товара со скидкой
 *
 * Тест-кейс проверяет процесс оформления заказа авторизованным пользователем
 * для товара со скидкой (Yellow Duck).
 *
 * Шаги теста:
 * 1. Авторизация пользователя
 * 2. Очистка корзины
 * 3. Выбор товара со скидкой и проверка отображения цены со скидкой
 * 4. Добавление товара в корзину с указанием количества и размера
 * 5. Проверка корзины (количество, цена за единицу, общая цена)
 * 6. Оформление заказа и проверка успеха
 */
import { test, expect } from '@fixtures/authenticated';
import { PRODUCTS, QUANTITIES, SIZES } from '@data/products';
import { calculateTotal } from '@utils/price';

test.describe('TC2: Заказ одного товара со скидкой', () => {
  test('Заказ одного товара со скидкой', async ({ homePage, productPage, cartPage }) => {
    // Тестовые данные
    const product = PRODUCTS.yellowDuck;
    const size = SIZES.small;
    const quantity = QUANTITIES.two;

    await test.step('Очистка корзины', async () => {
      // Переходим в корзину и очищаем её перед началом теста
      await homePage.open();
      await homePage.goToCart();
      await cartPage.clearCart();
    });

    await test.step('Выбор товара со скидкой', async () => {
      // Возвращаемся на главную страницу и проверяем, что корзина пуста
      await homePage.open();
      await homePage.expectCartIsEmpty();
      // Открываем страницу выбранного товара
      await homePage.openProduct(product.name);
    });

    let expectedUnitPrice = 0;
    await test.step('Добавление товара в корзину', async () => {
      // Убеждаемся, что отображается цена со скидкой
      await productPage.expectCampaignPriceVisible();
      // Получаем цену товара со скидкой
      expectedUnitPrice = await productPage.getUnitPrice();
      // Устанавливаем количество, размер и добавляем в корзину
      await productPage.setQuantity(quantity);
      await productPage.selectSize(size);
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
