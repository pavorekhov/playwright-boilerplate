/**
 * Базовый класс для всех страниц
 * Содержит общие методы, доступные на всех страницах приложения
 */
import { Page } from '@playwright/test';
import { requireEnv } from '@config/env';

export class BasePage {
  /** Страница Playwright, к которой привязан объект страницы */
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Открывает страницу по указанному пути
   * @param path - путь относительно базового URL (по умолчанию корень)
   */
  async open(path = ''): Promise<void> {
    const baseUrl = requireEnv('baseUrl');
    await this.page.goto(`${baseUrl}${path}`);
  }

}
