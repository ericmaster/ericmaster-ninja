import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { ChatServiceMock } from './ChatServiceMock.ts';

/**
 * Verifies the O(N)-space Levenshtein refactor (ENINJA-28) preserves the exact
 * output of the original O(N*M) full-matrix implementation. The distance method
 * is private, so we reach it through a typed accessor and compare it, over a
 * battery of inputs, against a reference copy of the pre-optimization algorithm.
 */

// Reference implementation: a verbatim copy of the ORIGINAL full-matrix
// algorithm that existed before the two-row optimization. Used as the oracle.
function levenshteinReference(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1),
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Typed accessor for the private instance method under test.
type LevenshteinFn = (a: string, b: string) => number;
function getLevenshtein(service: ChatServiceMock): LevenshteinFn {
  const fn = (service as unknown as { levenshtein: LevenshteinFn }).levenshtein;
  return fn.bind(service);
}

describe('ChatServiceMock.levenshtein (O(N)-space refactor)', () => {
  const levenshtein = getLevenshtein(new ChatServiceMock());

  it('matches known distances, including edge cases', () => {
    const cases: Array<[string, string, number]> = [
      ['', '', 0],
      ['', 'abc', 3],
      ['abc', '', 3],
      ['abc', 'abc', 0],
      ['kitten', 'sitting', 3],
      ['flaw', 'lawn', 2],
      ['a', 'b', 1],
      ['hiring', 'hirng', 1], // deletion
      ['auditor', 'auditer', 1], // substitution
      ['privacy', 'privcy', 1], // real keyword typo
    ];
    for (const [a, b, expected] of cases) {
      assert.equal(levenshtein(a, b), expected, `levenshtein(${JSON.stringify(a)}, ${JSON.stringify(b)})`);
    }
  });

  it('is symmetric in its arguments', () => {
    const pairs: Array<[string, string]> = [
      ['auditor', 'editor'],
      ['recruitment', 'recruiter'],
      ['', 'nonempty'],
      ['same', 'same'],
    ];
    for (const [a, b] of pairs) {
      assert.equal(levenshtein(a, b), levenshtein(b, a), `symmetry ${a}/${b}`);
    }
  });

  it('produces identical output to the original full-matrix algorithm', () => {
    // Deterministic battery drawn from the keyword map plus common typos and
    // strings of differing lengths — no randomness, so the suite stays stable.
    const words = [
      '', 'a', 'ab', 'abc', 'audit', 'auditor', 'auditer', 'hiring', 'hirng',
      'privacy', 'privcy', 'security', 'securty', 'pricing', 'priceing',
      'interview', 'intervew', 'automation', 'automaton', 'consultation',
      'kitten', 'sitting', 'flaw', 'lawn', 'xyzzy', 'aaaa', 'aaab',
    ];
    for (const a of words) {
      for (const b of words) {
        assert.equal(
          levenshtein(a, b),
          levenshteinReference(a, b),
          `optimized vs reference mismatch for (${a}, ${b})`,
        );
      }
    }
  });
});

describe('ChatServiceMock fuzzy intent matching (exercises levenshtein)', () => {
  let service: ChatServiceMock;

  beforeEach(() => {
    // Drive sendMessage past its artificial setTimeout latency synchronously.
    mock.timers.enable({ apis: ['setTimeout'] });
    service = new ChatServiceMock();
  });

  afterEach(() => {
    mock.timers.reset();
  });

  async function send(message: string) {
    const pending = service.sendMessage(message);
    mock.timers.tick(2000);
    return pending;
  }

  it('routes a typo\'d keyword to its intent via fuzzy (Levenshtein) matching', async () => {
    // "hirng" is not a substring of "hiring" and only matches by edit distance 1,
    // so a correct Levenshtein result is required to reach the hiring response.
    const response = await send('hirng');
    assert.match(response.text, /Technical Interviewer/);
  });
});
