# Strict Content-Security-Policy via the Alpine.js CSP build

**Status:** accepted (2026-05-26)

## Context

The static **Site** ships with no Content-Security-Policy and no clickjacking/sniffing
headers. We want a CSP whose `script-src` is actually meaningful — i.e. without
`'unsafe-eval'`.

The standard Alpine.js v3 build compiles `x-data`/`x-on`/etc. expressions through the
`Function()` constructor, which a non-`'unsafe-eval'` CSP forbids. The CSP's own
recommended `nonce` + `strict-dynamic` approach is not available to us: nonces must be
injected per request, and the **Site** is pre-built HTML served as immutable static assets
with no per-request server step. So the choices were:

1. Keep the standard Alpine build and accept `script-src ... 'unsafe-eval'` — a CSP that
   provides almost no script-injection protection.
2. Switch to the `@alpinejs/csp` build, which forbids free-form inline expressions and
   requires every directive to reference data/methods on a registered `Alpine.data()`
   component — enabling `script-src 'self'` with `sha256` hashes for any `is:inline`
   scripts.

## Decision

Adopt option 2. Self-host `@alpinejs/csp` (bundled via npm, served from `'self'`) and
refactor the two components that use Alpine — `Header.astro` (mobile nav) and
`resume/ResumeNav.astro` (scroll-spy) — into registered `Alpine.data()` components.
Deliver headers through a `public/_headers` file (copied into `./dist`); per Cloudflare,
`_headers` applies only to static-asset responses, so the **Worker**'s OAuth-callback CSP
stays defined in `worker/index.ts`.

This was cheap to choose because Alpine's footprint is tiny (two simple components). It
deliberately overrides the AGENTS.md "Alpine loaded via CDN" rule and constrains how all
future Alpine code is written (no inline expressions — register components instead).

## Consequences

- `script-src` becomes `'self' https://platform.linkedin.com` (LinkedIn badge); no
  `'unsafe-eval'`, no `cdn.jsdelivr.net` for scripts.
- `style-src` must keep `'unsafe-inline'`: KaTeX emits inline `style=` attributes on
  rendered math. Accepted as low risk.
- Every future piece of Alpine interactivity must be authored as a registered component,
  not an inline attribute expression.
