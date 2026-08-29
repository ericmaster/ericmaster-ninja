// src/lib/dateUtils.ts

/**
 * Formats a date string to a localized date string.
 * @param dateStr - The date string to format (ISO or RFC 2822).
 * @param locale - Optional locale string (defaults to user's locale).
 * @param options - Optional Intl.DateTimeFormat options.
 * @returns Localized date string.
 */
export function formatLocalizedDate(
  dateStr: string,
  locale?: string,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString(locale, options);
}
