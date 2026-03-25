import { test, describe } from 'node:test';
import assert from 'node:assert';
import { formatLocalizedDate } from './dateUtils.ts';

describe('formatLocalizedDate', () => {
  test('formats valid ISO date correctly', () => {
    const result = formatLocalizedDate('2023-05-15T00:00:00Z', 'en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' });
    assert.strictEqual(result, 'May 15, 2023');
  });

  test('formats valid RFC 2822 date correctly', () => {
    const result = formatLocalizedDate('Mon, 15 May 2023 00:00:00 GMT', 'en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' });
    assert.strictEqual(result, 'May 15, 2023');
  });

  test('handles custom options', () => {
    const result = formatLocalizedDate('2023-05-15T00:00:00Z', 'en-US', { timeZone: 'UTC', year: 'numeric', month: 'short' });
    assert.strictEqual(result, 'May 2023');
  });

  test('handles invalid date string by returning empty string', () => {
    const result = formatLocalizedDate('invalid');
    assert.strictEqual(result, '');
  });
});
