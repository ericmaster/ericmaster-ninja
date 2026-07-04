/** Typed environment bindings for the Cloudflare Worker */
interface Env {
  GH_CLIENT_ID: string;
  GH_CLIENT_SECRET: string;
}

const CANONICAL_ORIGIN = "https://ericmaster.ninja";
const REDIRECT_URI = `${CANONICAL_ORIGIN}/api/auth`;

/**
 * Guards against XSS injection characters before the value is embedded in
 * JSON.stringify() output. Allows only chars that are safe in a JS string
 * context: alphanumeric, underscores, hyphens, and dots (GitHub token format).
 * This is NOT a token-validity check — it is an XSS character guard.
 */
function isScriptSafe(token: string): boolean {
  return /^[a-zA-Z0-9_\-\.]+$/.test(token);
}

const handleAuth = async (
  url: URL,
  env: Env
): Promise<Response> => {
  const { GH_CLIENT_ID: client_id, GH_CLIENT_SECRET: client_secret } = env;
  const code = url.searchParams.get("code");

  if (!code) {
    const params = new URLSearchParams({
      client_id,
      redirect_uri: REDIRECT_URI,
      scope: "read:user user:email repo",
    });
    const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
    return Response.redirect(githubAuthUrl);
  }

  // Exchange code for access token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  const tokenData = (await tokenRes.json()) as { access_token?: string };
  if (!tokenData.access_token) {
    return new Response("OAuth failed", { status: 401 });
  }

  // Guard against XSS injection characters before embedding in JSON.stringify()
  if (!isScriptSafe(tokenData.access_token)) {
    return new Response("Invalid token format", { status: 400 });
  }

  // Per-request nonce — makes script-src narrowly allow only this exact script
  const nonce = crypto.randomUUID();
  const content = { token: tokenData.access_token, provider: "github" };
  const html = `<!DOCTYPE html>
<html>
  <body>
    <script nonce="${nonce}">
      const content = ${JSON.stringify(content)};
      if (window.opener) {
        const receiveMessage = (message) => {
          // Validate the sender origin against the canonical allowlist before
          // replying — otherwise any page holding an opener reference could
          // trigger this handler and receive the GitHub token.
          if (message.origin !== "${CANONICAL_ORIGIN}") {
            return;
          }
          window.opener.postMessage(
            'authorization:github:success:' + JSON.stringify(content),
            "${CANONICAL_ORIGIN}"
          );
          window.removeEventListener("message", receiveMessage, false);
        };
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "${CANONICAL_ORIGIN}");
      } else {
        document.write('Authentication successful. You may close this window.');
      }
    </script>
  </body>
</html>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "Content-Security-Policy": `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'none';`,
      "X-Content-Type-Options": "nosniff",
    },
  });
};

export default {
  async fetch(
    request: Request,
    env: Env
  ): Promise<Response> {
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/ai-cheatsheets":
        return fetch('https://ericmaster.github.io' + url.pathname);
      case "/api/auth":
        return handleAuth(url, env);
      default:
        return new Response("Not Found", { status: 404 });
    }
  },
} satisfies ExportedHandler;
