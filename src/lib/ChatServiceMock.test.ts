import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { ChatServiceMock } from './ChatServiceMock.ts';

/**
 * A neutral, non-inquiry message that resolves to the "default" intent:
 * it is not a question, contains no inquiry keywords, and does not fuzzy-match
 * any keyword synonym. This lets us observe exchangeCount / lastDefaultIndex
 * behaviour without tripping the inquiry / affirmative fallbacks.
 */
const NEUTRAL = 'xyzzy';

describe('ChatServiceMock.resetSession', () => {
  let service: ChatServiceMock;

  beforeEach(() => {
    // Mock setTimeout so we can drive sendMessage past its artificial latency
    // (600ms - 1500ms) synchronously and deterministically.
    mock.timers.enable({ apis: ['setTimeout'] });
    service = new ChatServiceMock();
  });

  afterEach(() => {
    mock.timers.reset();
  });

  // Drives sendMessage to completion despite the artificial setTimeout latency.
  async function send(message: string) {
    const pending = service.sendMessage(message);
    // Advance past the maximum possible latency so the setTimeout callback fires.
    mock.timers.tick(2000);
    return pending;
  }

  it('resets exchangeCount so the WhatsApp fallback is not triggered prematurely', async () => {
    // Third neutral exchange normally hits the "MAX_EXCHANGES" WhatsApp fallback (has a cta).
    await send(NEUTRAL);
    await send(NEUTRAL);
    const third = await send(NEUTRAL);
    assert.ok(third.cta, 'expected the third exchange to hit the WhatsApp fallback');

    service.resetSession();

    // After reset the exchange counter is back to 0, so the next neutral message
    // returns a plain default response instead of the fallback.
    const afterReset = await send(NEUTRAL);
    assert.equal(afterReset.cta, undefined);
  });

  it('resets lastDefaultIndex so default responses rotate from the start again', async () => {
    const first = await send(NEUTRAL);
    const second = await send(NEUTRAL);
    // The two default responses must differ (index 0 then index 1).
    assert.notEqual(second.text, first.text);

    service.resetSession();

    // With lastDefaultIndex reset to -1, rotation restarts at index 0.
    const afterReset = await send(NEUTRAL);
    assert.equal(afterReset.text, first.text);
  });

  it('is idempotent and safe to call on a fresh session', async () => {
    assert.doesNotThrow(() => service.resetSession());
    service.resetSession();

    const response = await send(NEUTRAL);
    assert.equal(response.cta, undefined);
    assert.equal(typeof response.text, 'string');
  });
});
