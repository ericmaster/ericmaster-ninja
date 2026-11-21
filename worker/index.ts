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
      default: {
        // Static Astro assets, including the text bootstrap, are served by the
        // configured ASSETS binding; API routes stay above this fallback.
        const assetResponse = await env.ASSETS.fetch(request);
        if (
          assetResponse.status === 404 &&
          (request.method === "GET" || request.method === "HEAD")
        ) {
          const esTagMatch = /^\/es\/tags\/([^/]+)\/?$/.exec(url.pathname);
          if (esTagMatch) {
            let decodedTag = "";
            try {
              decodedTag = decodeURIComponent(esTagMatch[1]);
            } catch {
              return assetResponse;
            }
            if (
              decodedTag &&
              decodedTag !== "." &&
              decodedTag !== ".." &&
              !decodedTag.includes("/") &&
              !decodedTag.includes("\\")
            ) {
              const enPath = `/tags/${encodeURIComponent(decodedTag)}/`;
              const enUrl = new URL(enPath, url.origin);
              const enCheck = await env.ASSETS.fetch(enUrl.toString(), {
                method: "HEAD",
              });
              if (enCheck.status === 200) {
                return new Response(null, {
                  status: 301,
                  headers: {
                    Location: enPath,
                    "Cache-Control": "public, max-age=3600",
                  },
                });
              }
            }
          }
        }
        return assetResponse;
      }
    }
  },
} satisfies ExportedHandler;
