import { test } from 'node:test';
import assert from 'node:assert';
import { formatLocalizedDate } from './dateUtils.ts';

test('formatLocalizedDate formats a valid date string correctly', () => {
  const dateStr = '2023-10-27T00:00:00Z';
  const result = formatLocalizedDate(dateStr, 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
  assert.strictEqual(result, 'October 27, 2023');
});

test('formatLocalizedDate uses default options if none provided', () => {
  const dateStr = '2023-10-27T00:00:00Z';
  const result = formatLocalizedDate(dateStr);
  assert.ok(result);
  assert.notStrictEqual(result, 'Invalid Date');
});

test('formatLocalizedDate returns an empty string for invalid date strings', () => {
  const invalidDateStr = 'not-a-date';
  const result = formatLocalizedDate(invalidDateStr);
  assert.strictEqual(result, '');
});
