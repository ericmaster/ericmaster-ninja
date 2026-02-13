import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  // Proxy to the external URL
  return fetch('https://ericmaster.github.io' + url.pathname);
};
