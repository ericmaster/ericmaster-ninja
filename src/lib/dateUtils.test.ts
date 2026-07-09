import test from 'node:test';
import assert from 'node:assert';
import { formatLocalizedDate } from './dateUtils.ts';

test('formatLocalizedDate formats date with default locale and options', () => {
  const dateStr = '2023-12-25';
  const result = formatLocalizedDate(dateStr, 'en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  assert.strictEqual(result, 'December 25, 2023');
});

test('formatLocalizedDate formats date with specific locale', () => {
  const dateStr = '2023-12-25';
  const result = formatLocalizedDate(dateStr, 'de-DE', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  // Note: German localization might use different characters depending on environment, but usually it is "25. Dezember 2023"
  assert.match(result, /25\. Dezember 2023/);
});

test('formatLocalizedDate formats date with custom options', () => {
  const dateStr = '2023-12-25';
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: '2-digit', month: 'short', day: 'numeric', timeZone: 'UTC' };
  const result = formatLocalizedDate(dateStr, 'en-US', options);
  assert.strictEqual(result, 'Mon, Dec 25, 23');
});

test('formatLocalizedDate returns empty string for invalid date', () => {
  const result = formatLocalizedDate('invalid-date');
  assert.strictEqual(result, '');
});
