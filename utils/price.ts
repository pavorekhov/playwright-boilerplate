export function parsePrice(text: string | null): number {
  if (!text) return 0;
  const match = text.match(/\d+(?:[.,]\d+)?/);
  return match ? parseFloat(match[0].replace(',', '.')) : 0;
}
