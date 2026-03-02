/**
 * Converts a standard English number to Eastern Arabic numerals.
 * Example: 123 -> ١٢٣
 */
export function toArabicNumber(num: number | string): string {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, (w) => arabicNumbers[+w]);
}
