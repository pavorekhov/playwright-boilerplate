import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('TC4: Невалидный логин', () => {
  test('Неверный ввод пароля при логине', async ({ page }) => {
    const login = new LoginPage(page);

    await test.step('Открытие страницы логина', async () => {
      await login.open();
    });

    await test.step('Ввод неверного пароля', async () => {
      await login.login(process.env.LOGIN!, 'wrong-password-123');
    });

    await test.step('Проверка сообщения об ошибке', async () => {
      await login.expectLoginFailedWithErrorMessage();
    });
  });
});
