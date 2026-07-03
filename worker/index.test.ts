import { test, mock } from 'node:test';
import assert from 'node:assert';
import worker from './index.ts';

test('Proxy /ai-cheatsheets uses hardcoded URL', async (t) => {
  const fetchMock = mock.fn(async (input: RequestInfo | URL) => {
    return new Response('Mocked Response');
  });

  // @ts-ignore
  globalThis.fetch = fetchMock;

  const request = new Request('https://ericmaster.ninja/ai-cheatsheets');
  const env = { GH_CLIENT_ID: 'id', GH_CLIENT_SECRET: 'secret' };

  const response = await worker.fetch(request, env);
  const text = await response.text();

  assert.strictEqual(text, 'Mocked Response');
  assert.strictEqual(fetchMock.mock.callCount(), 1);
  const firstCall = fetchMock.mock.calls[0];
  assert.strictEqual(firstCall.arguments[0], 'https://ericmaster.github.io/ai-cheatsheets');
});

test('Other paths do not use proxy logic', async (t) => {
  const fetchMock = mock.fn(async (input: RequestInfo | URL) => {
    return new Response('Should not be called');
  });

  // @ts-ignore
  globalThis.fetch = fetchMock;

  const request = new Request('https://ericmaster.ninja/something-else');
  const env = { GH_CLIENT_ID: 'id', GH_CLIENT_SECRET: 'secret' };

  const response = await worker.fetch(request, env);
  
  assert.strictEqual(response.status, 404);
  assert.strictEqual(fetchMock.mock.callCount(), 0);
});
