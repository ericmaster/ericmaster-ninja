import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChatServiceMock } from './ChatServiceMock';

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
    vi.useFakeTimers();
    service = new ChatServiceMock();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Drives sendMessage to completion despite the artificial setTimeout latency.
  async function send(message: string) {
    const pending = service.sendMessage(message);
    await vi.runAllTimersAsync();
    return pending;
  }

  it('resets exchangeCount so the WhatsApp fallback is not triggered prematurely', async () => {
    // Third neutral exchange normally hits the "MAX_EXCHANGES" WhatsApp fallback (has a cta).
    await send(NEUTRAL);
    await send(NEUTRAL);
    const third = await send(NEUTRAL);
    expect(third.cta).toBeDefined();

    service.resetSession();

    // After reset the exchange counter is back to 0, so the next neutral message
    // returns a plain default response instead of the fallback.
    const afterReset = await send(NEUTRAL);
    expect(afterReset.cta).toBeUndefined();
  });

  it('resets lastDefaultIndex so default responses rotate from the start again', async () => {
    const first = await send(NEUTRAL);
    const second = await send(NEUTRAL);
    // The two default responses must differ (index 0 then index 1).
    expect(second.text).not.toBe(first.text);

    service.resetSession();

    // With lastDefaultIndex reset to -1, rotation restarts at index 0.
    const afterReset = await send(NEUTRAL);
    expect(afterReset.text).toBe(first.text);
  });

  it('is idempotent and safe to call on a fresh session', async () => {
    expect(() => service.resetSession()).not.toThrow();
    service.resetSession();

    const response = await send(NEUTRAL);
    expect(response.cta).toBeUndefined();
    expect(typeof response.text).toBe('string');
  });
});
