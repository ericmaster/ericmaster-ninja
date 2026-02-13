globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async ({ request, locals }) => {
  const url = new URL(request.url);
  const env = locals.runtime.env;
  const { GH_CLIENT_ID: client_id, GH_CLIENT_SECRET: client_secret } = env;
  const code = url.searchParams.get("code");
  if (!code) {
    const params = new URLSearchParams({
      client_id,
      redirect_uri: "https://ericmaster.ninja/api/auth",
      scope: "read:user user:email repo"
    });
    const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
    return Response.redirect(githubAuthUrl);
  }
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code,
      redirect_uri: "https://ericmaster.ninja/api/auth"
    })
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return new Response("OAuth failed", { status: 401 });
  }
  const content = { token: tokenData.access_token, provider: "github" };
  const html = `<!DOCTYPE html>
<html>
  <body>
    <script>
      const content = ${JSON.stringify(content)};
      if (window.opener) {
        const receiveMessage = (message) => {
          window.opener.postMessage(
            'authorization:github:success:' + JSON.stringify(content),
            message.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        };
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
        // window.close();
      } else {
        // fallback: show token for manual copy
        document.write('Authentication successful. You may close this window.');
      }
    <\/script>
  </body>
</html>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
