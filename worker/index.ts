interface Env { ASSETS: Fetcher; }

export default {
  async fetch(
    request: Request,
    env: Env
  ): Promise<Response> {
    const url = new URL(request.url);
    // Dedicated public CMS endpoints are retired; preserve unrelated routes.
    if (["/admin", "/api/auth"].some(prefix =>
      url.pathname === prefix || url.pathname.startsWith(prefix + "/"))) {
      return new Response(request.method === "HEAD" ? null : "This editor has been retired.", {
        status: 410,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "no-referrer",
        },
      });
    }
    switch (url.pathname) {
      case "/ai-cheatsheets":
        return fetch('https://ericmaster.github.io' + url.pathname);
      default:
        // Static Astro assets, including the text bootstrap, are served by the
        // configured ASSETS binding; API routes stay above this fallback.
        return env.ASSETS.fetch(request);
    }
  },
} satisfies ExportedHandler;
