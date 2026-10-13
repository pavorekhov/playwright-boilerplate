/**
 * TC4: Невалидный логин
 *
 * Тест-кейс проверяет обработку ошибки при вводе неверного пароля при авторизации.
 *
 * Шаги теста:
 * 1. Открытие страницы логина
 * 2. Ввод неверного пароля
 * 3. Проверка появления сообщения об ошибке
 */
import { test } from '@fixtures/page-objects';
import { requireEnv } from '@config/env';

test.describe('TC4: Невалидный логин', () => {
  test('Неверный ввод пароля при логине', async ({ loginPage }) => {
    await test.step('Открытие страницы логина', async () => {
      // Открываем страницу логина и проверяем, что поле email видимо
      await loginPage.open();
    });

    await test.step('Ввод неверного пароля', async () => {
      // Вводим корректный email и неверный пароль
      await loginPage.login(requireEnv('login'), 'wrong-password-123');
    });

    await test.step('Проверка сообщения об ошибке', async () => {
      // Проверяем, что отображается сообщение об ошибке авторизации
      await loginPage.expectLoginFailed();
    });
  });
});
