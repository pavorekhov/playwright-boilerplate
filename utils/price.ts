/**
 * Извлекает первое числовое значение из текста цены.
 * Поддерживает точку и запятую в качестве десятичного разделителя.
 *
 * @param text Текст цены; `null` или пустая строка преобразуются в `0`.
 * @returns Цена в виде числа; если число не найдено, возвращает `0`.
 */
export function parsePrice(text: string | null): number {
  if (!text) return 0;
  const match = text.match(/\d+(?:[.,]\d+)?/);
  return match ? parseFloat(match[0].replace(',', '.')) : 0;
}

/**
 * Рассчитывает общую стоимость товара для заданного количества.
 *
 * @param unitPrice Цена за одну единицу товара.
 * @param quantity Количество единиц товара.
 * @returns Цена за единицу, умноженная на количество.
 */
export function calculateTotal(unitPrice: number, quantity: number): number {
  return unitPrice * quantity;
}
