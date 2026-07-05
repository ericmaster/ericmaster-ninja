import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isScriptSafe } from './index.ts';

/**
 * `isScriptSafe` is the XSS character guard applied to the GitHub access token
 * before it is embedded (via JSON.stringify) into the inline auth-callback
 * script. It must accept only characters that are inert inside a JS string
 * literal — alphanumeric, underscore, hyphen, and dot (the GitHub token
 * alphabet) — and reject everything else, especially quotes, angle brackets,
 * and whitespace/control characters that could break out of the string.
 */
describe('isScriptSafe', () => {
  describe('accepts safe tokens (GitHub token alphabet)', () => {
    const valid = [
      'abc',
      'ABC',
      '0123456789',
      'a1b2c3',
      'token_with_underscores',
      'token-with-hyphens',
      'token.with.dots',
      'gho_16C7e42F292c6912E7710c838347Ae178B4a',
      'ghp_1234567890abcdefABCDEF_-.',
      '_',
      '-',
      '.',
      'A',
    ];

    for (const token of valid) {
      it(`accepts ${JSON.stringify(token)}`, () => {
        assert.equal(isScriptSafe(token), true);
      });
    }
  });

  describe('rejects unsafe tokens', () => {
    const invalid = [
      '', // empty — the regex requires at least one character
      ' ', // space
      'has space',
      'tab\there',
      'new\nline',
      'carriage\rreturn',
      'quote"here', // double quote — could close the JS string literal
      "apostrophe'here", // single quote
      'back`tick',
      'angle<bracket>', // could inject a </script> sequence
      '</script>',
      'semicolon;here',
      'back\\slash',
      'slash/here',
      'plus+sign',
      'equals=sign',
      'percent%20encoded',
      'unicodeé', // accented character outside the allowed set
      'emoji\u{1F600}',
      'null\0byte',
      'brace{here}',
      'paren(here)',
      'at@sign',
      'hash#tag',
    ];

    for (const token of invalid) {
      it(`rejects ${JSON.stringify(token)}`, () => {
        assert.equal(isScriptSafe(token), false);
      });
    }
  });
});
