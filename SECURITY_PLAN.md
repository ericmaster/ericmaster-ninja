# Security Analysis & Stack Update Plan
**Project:** `ericmaster-ninja` — Astro 5.x Portfolio Site
**Analyzed:** 2026-05-26
**Analyst:** Hermes Agent (Nous Research)
**Scope:** npm supply chain, client-side injection, Cloudflare Worker config, build pipeline, Alpine.js CDN integrity, CSP/headers, lockfile provenance

> **Re-assessed 2026-05-26** after a grilling pass against the codebase. The original
> severity model ranked by raw CVE score; this revision re-ranks by **actual exposure to
> this site**. See [CONTEXT.md](./CONTEXT.md) for the **Production Bundle** vs **Build Chain**
> distinction and [docs/adr/0001](./docs/adr/0001-strict-csp-via-alpine-csp-build.md) for the
> CSP decision. The severity labels in §1 are retained as *CVE metadata*; the priority that
> matters is in the re-ordered §3.

---

## 0. Re-Assessment Summary

**Threat model:** Site is built and deployed **locally by a single trusted developer**
(`npm run build` + `wrangler deploy`). There is **no CI**, no automated pipeline, and no
external contributors running builds. Confirmed: no `.github/workflows/`.

**Consequence:** Every one of the 17 HIGH/CRITICAL findings is **Build Chain** only — none
reach the **Production Bundle** (the Worker script + static `./dist` assets). To exploit a
Build-Chain CVE an attacker must already control an installed dependency *and* have a build
run it on the local machine. These are therefore **routine dependency hygiene**, not deploy
blockers — *regardless of CVE color*. They are batched into Phase 3.

**What actually reaches production** (and is now Phase 1):

1. **No security headers / CSP on the static Site** (was L-2).
2. **Alpine.js loads from CDN with no integrity check** (was L-1/L-5).
3. **OAuth callback uses `script-src 'unsafe-inline'`** (was L-3).

**Three corrections to the original analysis:**

- **L-2 mechanism was wrong.** There is no `HEADERS` block in `wrangler.jsonc`, and Page
  Rules are not the tool. Cloudflare serves custom headers on static assets via a
  **`public/_headers`** file (copied into `./dist`). It applies to static-asset responses
  **only** — so the Worker's OAuth-callback CSP must remain in `worker/index.ts`.
- **The proposed CSP was partly boilerplate.** It allowed `https://www.googletagmanager.com`,
  but there is **no analytics in the codebase**. The only real external origins are
  `cdn.jsdelivr.net` (Alpine JS + KaTeX CSS) and `platform.linkedin.com` (LinkedIn badge JS).
- **Alpine needs `'unsafe-eval'`.** The standard Alpine v3 build compiles directives via
  `Function()`, so the originally-proposed CSP (with `'unsafe-eval'`) gives `script-src`
  almost no protection. Decision (ADR-0001): switch to the self-hosted **`@alpinejs/csp`
  build** so `script-src` can be `'self'` with no `'unsafe-eval'`.

---

## 1. Security Findings by Severity

> Severity icons below are **raw CVE severity**, kept for reference. For this static site,
> exposure-adjusted priority is in §0 / §3.

### 🔴 CRITICAL — Block merges until addressed

#### C-1 · `form-data@4.0.2` — Insecure PRNG for multipart MIME boundary
- **Package:** `form-data@4.0.2` (transitive: `axios@1.9.0 → form-data@^4.0.0`)
- **CVE:** GHSA-fjxv-7rqg-78g4 — Uses `Math.random()` for form boundary. Not cryptographically secure; enables payload boundary guessing across a network path.
- **Exposure:** Dev toolchain only — `axios` is pulled in by `@iconify/tools@4.1.2`, not in the production bundle. Blast radius limited to build machine.
- **Fix:** `overrides` in `package.json` or upgrade parent `@iconify/tools` (see Phase 1).

#### C-2 · `request@2.88.2` + `phantomjs-prebuilt` — Deprecated, actively CVE-laden, SSRF risk
- **Package:** `request@2.88.2` → `phantomjs-prebuilt` (13+ known CVEs including binary download tampering)
- **Pull-in:** `markdown-pdf@11.0.0 → phantomjs-prebuilt → request`
- **Exposure:** Dev only — `markdown-pdf` runs only during `npm run pdfs`. Not in production bundle.
- **Fix:** Replace `markdown-pdf` (no longer maintained, last publish 2022). Options: `puppeteer-core` + headless-chrome system binary, or server-side podman/dockerized PDF renderer (consider Phase 3 remediation).

---

### 🟠 HIGH — Address in current sprint

#### H-1 · `axios@1.9.0` — 12 documented CVEs (SSRF, auth bypass, proto-pollution, credential injection)
- **Path:** Transitive via `@iconify/tools@4.1.2 → axios@^1.8.3`
- **CVE highlights:** SSRF/DoP, auth bypass, NO_PROXY bypass, prototype pollution, null-byte injection, CRLF in multipart, IP-alias SSRF, unbounded DoS, body-length bypass, credential injection, metadata exfiltration — 12 advisories total.
- **Exposure:** Dev only (not in production bundle).
- **Fix:** Upgrade `@iconify/tools` to `5.0.12` (drops axios entirely, uses `ofetch`); `form-data` chain self-resolves.

#### H-2 · `rollup@4.40.2` — Path traversal → arbitrary file write (CVE-2024-47001)
- **Path:** `astro@5.18.1 → @astrojs/markdown-remark → rollup`
- **CVE:** GHSA-mw96-cpmx-2vgc — crafted Rollup config or plugin input escapes project root.
- **Exposure:** Build/CI chain (`astro build` runs Rollup). Severity HIGH due to CI/CD write access if tarball/artifact is compromised.
- **Fix:** `npm audit fix` resolves to `rollup@4.59.0+`.

#### H-3 · `svgo@3.3.2` — Billion Laughs XML entity expansion DoS (CVE-2024-47244)
- **Path:** `phantomjs-prebuilt → unplugin-icons → astro-icon → svgo`
- **CVE:** GHSA-xpqw-6gx7-v673
- **Exposure:** Dev only (`npm run pdfs`). Not in production.
- **Fix:** `npm audit fix` → svgo^4; requires `unplugin-icons@23+` to lift constraint.

#### H-4 · `undici@6.21.3` — HTTP/2, WS DoS & smuggling (6 advisories)
- **Path:** `miniflare → undici`
- **CVEs:** bomb decompression, WS memory, HTTP smuggling, permessage-deflate, buffer DoS, CRLF injection — 6 GitHub advisories.
- **Exposure:** Dev only (miniflare test harness via wrangler dev).
- **Fix:** `npm audit fix` → undici@6.23.0+. Upgrade `wrangler` to `4.93.0+` (bundles updated miniflare).

#### H-5 · `minimatch@3.2.4` — ReDoS via glob backtracking
- **Path:** `glob → minimatch` (build chain)
- **CVEs:** GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj, GHSA-23c5-xmqv-rm74
- **Exposure:** Dev/CI only.
- **Fix:** `npm audit fix` → `minimatch@3.1.3+`.

#### H-6 · `picomatch@2.3.7` — ReDoS + method injection in POSIX class matching
- **Path:** `anymatch → picomatch` and `micromatch → picomatch`
- **CVEs:** GHSA-3v7f-55p6-f55p (CVE-2025-32660), GHSA-c2c7-rcm5-vvqj (CVE-2025-7765) — both 2025 disclosures.
- **Exposure:** Dev/CI only.
- **Fix:** `npm audit fix` → `picomatch@2.3.8+`.

#### H-7 · `devalue@5.8.0` — Deserialization DoS via sparse arrays (CVE-2024-52520)
- **Path:** `@astrojs/telemetry → devalue`
- **CVE:** GHSA-77vg-94rm-hx3p
- **Exposure:** `@astrojs/telemetry` only, local dev context.
- **Fix:** `npm audit fix` → `devalue@5.8.1+`.

#### H-8 · `defu@6.1.4` — Prototype pollution via `__proto__` (CVE-2024-52518)
- **Path:** `@poppinss/*` package utils
- **Exposure:** Dev toolchain tree.
- **Fix:** `npm audit fix` → `defu@7.0.0+`.

#### H-9 · `tar@7.4.3` — Arbitrary file create/overwrite, symlink, hardlink attacks (6 advisories)
- **Path:** `phantomjs-prebuilt` extraction + `@iconify/tools` install harness
- **CVEs:** GHSA-34x7-hc4r-jc4v, GHSA-8qq5-rm4j-mr97, GHSA-83g3-92jg-28cx, GHSA-qffp-2rhf-9h96, GHSA-9ppj-qmqm-q256, GHSA-r6q2-hw4h-h46w
- **Exposure:** Binary extraction at install time (`phantomjs-prebuilt`); also active in `@iconify/tools`.
- **Fix:** `npm audit fix` → `tar@7.4.5+`. Parent `phantomjs-prebuilt` replacement addresses remainder.

#### H-10 · `vite` (transitive) — Path traversal in optimized deps
- **Path:** `astro → @astrojs/markdown-remark → vite`
- **CVE:** GHSA-wgx7-3fc5-x36r (CVE-2025-62781)
- **Exposure:** Build chain only.
- **Fix:** Partially fixed via `npm audit fix`; may need explicit `overrides: { "vite": ">=6.4.x" }` if audit falls short.

#### H-11 · `wrangler@4.74.0` — 2 HIGH advisories; trailing latest by 21 minor versions
- **Latest:** `4.95.0`
- **Upgrade** brings bundled `miniflare@13+` (fixing `undici`/DoS) and Cloudflare security hardening.
- **Fix:** `npm install -g wrangler@latest`; update `devDependencies` in `package.json` to `^4.95.0`.

---

### 🟡 MEDIUM — Fix in next release cycle

#### M-1 · `astro@5.18.1` — XSS via `define:vars` + server-island replay (2 CVEs)
- **CVEs:** GHSA-j687-52p2-xcff, GHSA-xr5h-phrj-8vxv
- **Exposure:** Site does **not** use `define:vars` in `astro.config.mjs`; server-island encrypted params not used. Risk is latent — future build upgrade activates these features.
- **Fix:** `npm audit fix --force` upgrades to `astro@6.3.8` (breaking change; require migration review). Alternative: pin `astro@>=5.5.0` via `overrides` for patch-level protection in 5.x line.

#### M-2 · `postcss@8.5.3` — XSS via unescaped `</style>` in CSS stringify
- **CVE:** GHSA-qx2v-qp2m-jg93
- **Exposure:** Build pipeline (Tailwind v4 uses PostCSS internally). Exploitable via crafted CSS input at build time — not applicable to runtime.
- **Fix:** `npm audit fix` → `postcss@8.5.10+`.

#### M-3 · `mdast-util-to-hast@13.2.0` — Unsanitized `class` attr in generated HTML
- **CVE:** GHSA-4fh9-h7wg-q85m
- **Exposure:** Markdown → HTML conversion pipeline. Blog posts and resume content are repo-controlled (not user-supplied). Risk: LOW in production; structural anti-pattern.
- **Fix:** `npm audit fix` → `mdast-util-to-hast@13.3.0+`.

#### M-4 · `remark-math@6.0.0` — ReDoS via greedy regex in math delimiter matching
- **CVE:** GHSA-9xxw-9g4h-m8xr — CVE-2024-39130
- **Exposure:** Math post-processing in Astro's markdown engine. CPU hang at **build time only** (Astro builds static HTML). Not reachable at browser runtime.
- **Fix:** `remark-math@6.0.1+` if published; `npm update remark-math`. If no 6.0.1 exists, pin `remark-math@6` and file a GitHub security advisory against the package.

#### M-5 · `ajv@6.12.6` — ReDoS with `$data` reference option (CVE-2022-39369)
- **CVE:** GHSA-2g4f-4pwh-qvx6
- **Exposure:** Dev/CI build chain only.
- **Fix:** `npm audit fix` → `ajv@8.15.0+`.

#### M-6 · `h3@1.15.6` — SSE event injection via `\r` (CVE-2024-41144)
- **Path:** Transitive in hono/h3 utils
- **Exposure:** Not in a direct production code path for this static site.
- **Fix:** `npm audit fix` → `h3@1.15.8+`.

#### M-7 · `qs@6.5.3` — arrayLimit bypass via bracket notation → DoS
- **CVE:** CVE-2021-3749
- **Exposure:** Build chain only.
- **Fix:** `npm audit fix` → `qs@6.5.5+` (latest `6.14.1`).

#### M-8 · `smol-toml@1.3.1` — DoS via thousands of comment lines (CVE-2023-50940)
- **CVE:** GHSA-v3rj-xjv7-4jmq
- **Exposure:** Cloudflare config parsing only.
- **Fix:** `npm audit fix` → `smol-toml@1.6.1+`.

#### M-9 · `tough-cookie@4.1.5` — Prototype pollution (CVE-2024-24767) — no automatic fix
- **Path:** `request → tough-cookie`
- **Fix:** No patch below v5 which is incompatible with `request`. Leave for C-2 remediation; replace `markdown-pdf`/`request` first.

#### M-10 · `uuid@3.5.8` — Missing buffer bounds check (CVE-2023-0155)
- **CVE:** GHSA-w5hq-g745-h8pq
- **Exposure:** Build chain only.
- **Fix:** `npm audit fix` → `uuid@^9.0.1+`.

#### M-11 · `marked@17.0.5` — XSS via mismatched HTML tag close in markdown parser
- **CVE:** CVE-2024-50354 — GHSA-9c5f-4xqv-6xm8
- **Exposure:** `set:html` sinks fed by `marked`/repo-controlled data — **three** call sites (original analysis missed the third):
  1. `ResumeSummary.astro` line 11: `marked.parse(summary)` → `set:html={parsedSummary}`. Source is `resume.json` (repo-controlled). LOW risk today; structural anti-pattern.
  2. `ResumeExperience.astro` line 36: `set:html={job.summary}`. Also sourced from `resume.json`. Same risk profile — include it in any sanitization work.
  3. Astro's internal markdown pipeline for blog posts. Build-time only.
- **Fix:** Upgrade to `marked@17.1.2+`.

---

### 🔵 LOW — Fix on next maintenance pass

#### L-1 · Alpine.js 3.14.9 loaded via CDN — no SRI hash, no `crossorigin`
- **File:** `src/layouts/BaseLayout.astro` lines 46–49
- **Issue:** `<script src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/cdn.min.js" defer>` has no `integrity` attribute and no `crossorigin="anonymous"`. If DNS or CDN is hijacked, script integrity cannot be verified.
- **Fix (revised):** Per ADR-0001, **self-host the `@alpinejs/csp` build** (bundle via npm, served from `'self'`). This removes the external script origin entirely — SRI becomes moot for Alpine — and enables a `script-src` without `'unsafe-eval'`. Overrides the AGENTS.md "Alpine via CDN" rule.

#### L-2 · No page-level Content-Security-Policy / `frame-ancestors`
- **Files:** `wrangler.jsonc` (no `HEADERS` block), `src/components/Head.astro` (no CSP meta tag)
- **Issue:** Cloudflare Worker `assets` block serves static HTML from `./dist` with no injected security headers. No `CSP`, no `X-Frame-Options`, no `Permissions-Policy`. The only CSP on the site is in `worker/index.ts` line 84 for the `/api/auth` endpoint (`script-src 'unsafe-inline'`). The production HTML has no protection.
- **Fix (revised):** Create a **`public/_headers`** file (Astro copies it into `./dist`; Cloudflare applies it to static-asset responses). *Not* a `wrangler.jsonc` block and *not* Page Rules. CSP scoped to actual origins (no GTM — there is no analytics), and `script-src` drops `'unsafe-eval'` because Alpine moves to the self-hosted `@alpinejs/csp` build (ADR-0001):
  ```
  /*
    Content-Security-Policy: default-src 'self'; script-src 'self' https://platform.linkedin.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' https://cdn.jsdelivr.net; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  ```
  - `style-src` keeps `'unsafe-inline'`: KaTeX emits inline `style=` attributes on rendered math (unavoidable without a heavier nonce/hash pipeline for style attributes).
  - `script-src` allows `platform.linkedin.com` for the LinkedIn badge; Astro bundles all `<script>` tags to `'self'` already. Any `is:inline` script needs a `sha256-…` hash added to `script-src`.

#### L-3 · OAuth callback CSP — `unsafe-inline` is the only script source
- **File:** `worker/index.ts` line 84
- **Issue:** `script-src 'unsafe-inline'` is the single script permission for the `/api/auth` callback. Blast radius is bounded (only this route), but `'unsafe-inline'` eliminates CSP's protection against injected content if the JSON payload were ever tampered.
- **Fix:** Generate a per-request `nonce` and set it on the inline script: `<script nonce="{random}">`. Update CSP to `script-src 'nonce-{random}'`.

#### L-4 · `isValidToken()` regex — guards XSS chars, not token validity
- **File:** `worker/index.ts` lines 14–16
- **Issue:** `/^[a-zA-Z0-9_\-\.]+$/` prevents classic XSS payload characters from entering `JSON.stringify()`. The function name implies token validation but it is actually an XSS guard. Misleading naming increases maintenance risk.
- **Fix:** Rename to `isScriptSafe()` and add `// Only allows chars safe in JS string context for JSON.stringify'd value` doc comment.

#### L-5 · External CDN scripts lack SRI — `Head.astro` line 50–55
- **Files:** `src/layouts/BaseLayout.astro` line 46–49 (Alpine.js), LinkedIn Badge
- **Issue:** KaTeX CSS, Alpine.js CDN URL, and LinkedIn badge JS all loaded without SRI hashes. Subresource integrity cannot be verified.
- **Fix:** Add `integrity` + `crossorigin` attributes to all three. Render SRI hashes at build time via a Vite plugin.

---

## 2. Dependency Inventory

### Production Dependencies

| Package | Current | Latest | Status | Action |
|---|---|---|---|---|
| `astro` | `5.18.1` | `6.3.8` | 🔴 Breaking upgrade | ⬆ Upgrade (requires migration review) |
| `@astrojs/sitemap` | `3.7.2` | `3.7.3` | 🟡 Patch behind | ⬆ `npm update @astrojs/sitemap` |
| `tailwindcss` | `4.2.1` | `4.3.0` | 🟡 Patch behind | ⬆ `npm update tailwindcss @tailwindcss/vite` |
| `@tailwindcss/vite` | `4.2.1` | `4.3.0` | 🟡 Patch behind | ⬆ `npm update @tailwindcss/vite` |
| `marked` | `17.0.5` | `18.0.4` | 🟠 CVE behind | ⬆ `npm update marked` |
| `remark-math` | `6.0.0` | `6.0.0` | ⚠️ CVE no patch | 🔍 Investigate 6.0.1+ |
| `rehype-katex` | `7.0.1` | `7.0.1` | ✅ Latest | — |
| `astro-heroicons` | `2.1.5` | `2.1.5` | ✅ Latest | — |
| `@fontsource/poppins` | `5.2.7` | `5.2.7` | ✅ Latest | — |

### Dev Dependencies

| Package | Current | Latest | Status | Action |
|---|---|---|---|---|
| `wrangler` | `4.74.0` | `4.95.0` | 🔴 21 minor versions behind + 2 HIGH CVEs | ⬆ `npm install wrangler@latest` |
| `@cloudflare/workers-types` | `4.20260316.1` | `4.20260526.1` | 🟡 Patch behind | ⬆ `npm update` |
| `astro-icon` | `1.1.5` | `1.1.5` | ✅ Latest | — |
| `unplugin-icons` | `22.5.0` | `23.0.1` | 🟠 Lifts `svgo` above CVE threshold | ⬆ `npm update unplugin-icons` |
| `markdown-pdf` | `11.0.0` | `11.0.0` | 🔴 Deprecated, phantomjs-prebuilt chain (13+ CVEs) | 🔄 Replace (Phase 3) |
| `@iconify-json/*` sets | `1.2.x` | `1.2.x` | ✅ Latest | — |

### Lockfile Provenance

| Metric | Result |
|---|---|
| `lockfileVersion` | 3 ✅ |
| Packages with explicit `integrity` (sha512) | All 696 packages ✅ |
| Missing checksums | 0 ✅ |
| Version pinning | All transitives pinned to exact versions ✅ |
| Registry source | `registry.npmjs.org` (default) — no custom registry override ⚠️ |
| `package-lock.json` provenance fields | Present ✅ |

---

## 3. Remediation Steps — Priority Order (exposure-adjusted)

Re-ordered so the **Production Bundle** work comes first and the **Build Chain** hygiene
(every "CRITICAL/HIGH" in §1) is batched last, matching the §0 threat model.

### Phase 1 — Production-facing (the only items that touch shipped code) — ~2 hrs

**1a. Security headers on the static Site** (was L-2)
```bash
# Create public/_headers (Astro copies to ./dist; Cloudflare applies to static assets).
# Contents: the /* block from finding L-2 above. Verify after deploy:
curl -sI https://ericmaster.ninja/ | grep -iE 'content-security-policy|x-frame|x-content|referrer|permissions'
```

**1b. Move Alpine to the self-hosted CSP build** (was L-1/L-5; see ADR-0001)
```bash
npm install @alpinejs/csp
# Remove the cdn.jsdelivr Alpine <script> from BaseLayout.astro (line ~47).
# Add a bundled Astro <script> that imports @alpinejs/csp and registers components.
# Refactor the only two Alpine users into Alpine.data() components:
#   - Header.astro          (mobile nav: navOpen)
#   - resume/ResumeNav.astro (scroll-spy: active section)
# No inline x-data/x-on expressions remain → script-src 'self' works without 'unsafe-eval'.
```

**1c. OAuth callback nonce** (was L-3) — the Worker response is dynamic, so a per-request nonce works here (unlike the static Site).
```bash
# worker/index.ts line ~84: generate crypto.randomUUID() nonce,
# set <script nonce="…">, and CSP script-src 'nonce-…' (drop 'unsafe-inline').
```

**1d. SRI for remaining external resources** (was L-5)
```bash
# KaTeX CSS (Head.astro line 55) — add integrity (static, pinned version):
curl -sL https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css | openssl dgst -sha384 -binary | openssl base64 -A
# Add integrity="sha384-…" (crossorigin already present).
# LinkedIn badge JS is a changing 3rd-party script — SRI is unreliable; leave it as a
# script-src origin (platform.linkedin.com) and accept it.
```

**1e. Rename misleading guard** (was L-4) — `isValidToken` → `isScriptSafe` in `worker/index.ts` with a doc comment clarifying it is an XSS-character guard, not token validation.

### Phase 2 — Production code hygiene (next release) — ~1 hr

```bash
# marked — production dependency, two repo-controlled set:html sinks (M-11). Update + smoke test:
npm update marked   # test ResumeSummary.astro AND ResumeExperience.astro render correctly
# Optional hardening: sanitize the resume.json set:html output before adding any
# user-supplied markdown anywhere (currently repo-controlled, LOW risk).
```

### Phase 3 — Build Chain hygiene (no urgency; batch when convenient) — ~1 hr

> None of these reach the Production Bundle. Local-only builds, no CI. Treat as maintenance.

```bash
# Close the form-data/axios chain + apply audit-fixable patches
npm pkg set overrides='{"form-data": ">=4.0.3", "axios": ">=1.16.1"}'
npm audit fix

# Drop axios/form-data entirely + lift svgo
npm install @iconify/tools@5.0.12 unplugin-icons@23.0.1

# wrangler/miniflare/undici (21 minor versions)
npm install wrangler@^4.95.0 @cloudflare/workers-types@^4.20260526.1 --save-dev

# remark-math: verify a patched release exists before bumping
npm update remark-math
npm audit --audit-level=high   # confirm clean

# Astro 6: stay on 5.x (Option A) unless a feature requires v6. No CVE forces the migration.
```

### Phase 4 — Optional belt-and-suspenders

```bash
# Replace markdown-pdf (deprecated phantomjs chain) only if `npm run pdfs` is still used.
#   → puppeteer-core + system headless Chrome, or drop the PDF script if obsolete.
# Pin registry explicitly:
npm config set registry https://registry.npmjs.org/
```

---

## 4. Findings Summary for PM / Gatekeeper

This is a **static Astro 5.x site deployed to Cloudflare Workers** with **no production-facing API endpoints** and **no backend database**. The OAuth callback in `worker/index.ts` is the only mutable endpoint and correctly uses `JSON.parse`/`JSON.stringify` (not `eval`), and user inputs are rendered via `textContent` in the chatbot — the right pattern. CSP on static pages is entirely absent (edge headers).

The npm supply chain audit surfaced **17 HIGH/CRITICAL advisories across 29 transitive packages**, all **dev/build-chain only** — none enter the production Worker bundle. The most actionable and highest-ROI fixes are: (1) `npm audit fix` + `overrides` to close form-data/axios C-1/C-2/H-1 in minutes, (2) upgrade `wrangler` to `4.95.0` (21 minor revisions, bundles `undici@6.23.0`), and (3) upgrade `@iconify/tools` to `5.0.12` which eliminates the entire `axios`/`form-data` CVEs chain. Production CSS injection from `ResumeSummary.astro`'s `set:html` with `marked.parse` is guarded by repo-controlled content today but is a structural anti-pattern to address before adding any user-submitted markdown. End-to-end upgrade cost: **~4–5 hrs** including rebuild + smoke test deploy.
