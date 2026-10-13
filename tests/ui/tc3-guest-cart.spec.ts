/**
 * TC3: Гостевой заказ двух товаров и проверка Recently Viewed
 *
 * Тест-кейс проверяет процесс покупки в режиме гостя (без авторизации)
 * и проверку отображения недавно просмотренных товаров.
 *
 * Шаги теста:
 * 1. Очистка корзины
 * 2. Добавление первого товара (Blue Duck) в корзину
 * 3. Добавление второго товара (Yellow Duck) в корзину с выбором размера
 * 4. Проверка корзины (количество, цена за единицу, общая цена для каждого товара и итоговая сумма)
 * 5. Проверка, что данные по пользователю в форме оформления заказа пустые
 * 6. Проверка блока Recently Viewed на главной странице (должны отображаться оба товара)
 */
import { test, expect } from '@fixtures/guest';
import { PRODUCTS, QUANTITIES, SIZES } from '@data/products';
import { calculateTotal, parsePrice } from '@utils/price';

test.describe('TC3: Гостевой заказ двух товаров и проверка Recently Viewed', () => {
  test('Гостевой заказ двух товаров и проверка Recently Viewed', async ({ homePage, productPage, cartPage }) => {
    // Тестовые данные
    const products = [PRODUCTS.blueDuck, PRODUCTS.yellowDuck];
    const [product1, product2] = products;
    const size = SIZES.small;
    const quantity = QUANTITIES.one;

    await test.step('Очистка корзины', async () => {
      // Начинаем с пустой корзины
      await homePage.open();
      await homePage.goToCart();
      await cartPage.clearCart();
    });

    let expectedUnitPrice1 = 0;
    let expectedUnitPrice2 = 0;

    await test.step('Добавление первого товара (Blue Duck)', async () => {
      // Открываем главную страницу и переходим к товару
      await homePage.open();
      await homePage.openProduct(product1.name);
      // Получаем цену товара
      expectedUnitPrice1 = await productPage.getUnitPrice();
      // Устанавливаем количество и добавляем в корзину
      await productPage.setQuantity(quantity);
      await productPage.addToCart();
      // Проверяем обновление количества в корзине
      await expect(homePage.cartQuantity).toHaveText(String(quantity));
    });

    await test.step('Добавление второго товара (Yellow Duck)', async () => {
      // Возвращаемся на главную страницу и открываем второй товар
      await homePage.open();
      await homePage.openProduct(product2.name);
      // Получаем цену второго товара
      expectedUnitPrice2 = await productPage.getUnitPrice();
      // Устанавливаем количество, размер и добавляем в корзину
      await productPage.setQuantity(quantity);
      await productPage.selectSize(size);
      await productPage.addToCart();
      // Проверяем общее количество добавленных единиц в корзине (должно быть 2 в нашем случае, по одному каждого товара)
      await expect(homePage.cartQuantity).toHaveText(String(quantity * products.length));
      // Проверяем общую стоимость товаров в корзине (должна быть сумма цен обоих товаров)
      const expectedCartTotal =
        calculateTotal(expectedUnitPrice1, quantity) + calculateTotal(expectedUnitPrice2, quantity); //$38
      const actualCartTotal = parsePrice(await homePage.cartTotalValue.textContent());
      await expect(actualCartTotal).toBe(expectedCartTotal);
    });

    await test.step('Проверка корзины с двумя товарами', async () => {
      // Переходим в корзину для детальной проверки
      await homePage.goToCart();
      await cartPage.waitForLoad();
      // Ожидаем отдельную строку в корзине для каждого товара
      await expect(cartPage.itemRows).toHaveCount(products.length);

      // Проверяем первый товар (Blue Duck)
      const qty1 = await cartPage.getQuantityForProduct(product1.name);
      const unit1 = await cartPage.getUnitPriceForProduct(product1.name);
      const total1 = await cartPage.getTotalForProduct(product1.name);
      const expectedTotal1 = calculateTotal(expectedUnitPrice1, quantity);

      await expect(qty1).toBe(String(quantity));
      await expect(unit1).toBe(expectedUnitPrice1);
      await expect(total1).toBe(expectedTotal1);

      // Проверяем второй товар (Yellow Duck)
      const qty2 = await cartPage.getQuantityForProduct(product2.name);
      const unit2 = await cartPage.getUnitPriceForProduct(product2.name);
      const total2 = await cartPage.getTotalForProduct(product2.name);
      const expectedTotal2 = calculateTotal(expectedUnitPrice2, quantity);

      await expect(qty2).toBe(String(quantity));
      await expect(unit2).toBe(expectedUnitPrice2);
      await expect(total2).toBe(expectedTotal2);

      // Проверяем, что сумма заказа равна сумме стоимостей товаров
      const expectedOrderTotal = expectedTotal1 + expectedTotal2;
      const actualOrderTotal = total1 + total2;
      await expect(actualOrderTotal).toBe(expectedOrderTotal);
    });

    await test.step('Проверка пустых данных по пользователю', async () => {
      // Убеждаемся, что в форме оформления заказа все поля пустые (гость)
      await cartPage.expectBillingAddressIsEmpty();
    });

    await test.step('Проверка блока Recently Viewed', async () => {
      // Возвращаемся на главную страницу и проверяем блок недавно просмотренных товаров
      await homePage.open();
      const recentlyViewed = homePage.recentlyViewedProducts;
      // Ожидаем, что в блоке есть все товары, просмотренные в тесте
      await expect(recentlyViewed).toHaveCount(products.length);
      // Проверяем, что оба добавленных товара присутствуют в блоке
      await expect(homePage.getRecentlyViewedProduct(product1.name)).toBeVisible();
      await expect(homePage.getRecentlyViewedProduct(product2.name)).toBeVisible();
    });
  });
});
