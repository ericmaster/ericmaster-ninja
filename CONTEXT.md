# ericmaster-ninja

The ubiquitous language for Eric Aguayo's personal site and tech blog — a statically
generated Astro site deployed to Cloudflare Workers. This file is a glossary, not a spec:
it pins down what each term *means* so the same word isn't used two ways.

## Language

### Content

**Post**:
A blog article authored as a markdown file under `src/pages/posts/`, carrying the
frontmatter schema in `content.config.ts`. Has a `published` flag.
_Avoid_: article, entry, blog.

**Published**:
A property of a **Post**. An unpublished Post exists in the repo but is excluded from
listings and the sitemap. Not a deployment state — an unpublished Post still ships in the
build; it is filtered at render time.
_Avoid_: draft (a draft is an unpublished Post, not a separate thing), live.

**Content Fragment**:
A markdown prose body under `src/pages/content/pages/`, imported into a **Page** shell.
It holds the words; the Page holds the layout. Distinct from a Post — Fragments are page
copy, not articles.
_Avoid_: snippet, partial, include.

**Page**:
A route-bearing `.astro` file under `src/pages/`. A Page composes layout + components and
usually pulls its prose from a **Content Fragment**. The Resume and Posts are Pages too,
but back their content with structured data / markdown files rather than Fragments.

**Resume**:
The data-driven CV rendered from `src/data/resume.json` through the `resume/` components.
The JSON is the source of truth; the `.astro` components are pure presentation.

### Runtime surface

**Site**:
The static output (`./dist`) — pre-built HTML/CSS/JS served directly as Cloudflare static
assets. It is immutable per deploy and has no per-request server logic.
_Avoid_: app, frontend.

**Worker**:
The Cloudflare edge entry (`worker/index.ts`). The site's *only* dynamic surface: it
handles the GitHub OAuth callback (`/api/auth`) and one proxy route. Everything else falls
through to static **Site** assets. Responses it generates are dynamic (can carry a
per-request nonce); static **Site** assets cannot.
_Avoid_: server, backend, API (there is no general API).

**Chatbot**:
The client-side widget (`AiChatbot.astro` + `ChatServiceMock.ts`). A *mock* — keyword/fuzzy
matching, no LLM call, no network. Capped at 3 exchanges before deferring to WhatsApp.
_Avoid_: AI assistant, agent (it does not call a model).

### Security surface (resolved during the 2026-05-26 security review)

**Production Bundle**:
Code that actually ships and executes in production — the **Worker** script plus the static
**Site** assets. The relevant blast radius for a security finding. Distinct from the
**Build Chain**.
_Avoid_: "production dependencies" (npm's `dependencies` block is not the same set — most
of it is build-time-only).

**Build Chain**:
Tooling that runs only on the build machine during `npm run build` / `npm run pdfs` and
never ships to the edge (Astro, Rollup, Vite, iconify tooling, markdown-pdf, wrangler,
miniflare). A vulnerability here is reachable only by an attacker who already controls a
dependency *and* a build runs it — and builds run locally on a single trusted machine, with
no CI executing untrusted code. So Build-Chain CVEs rank as routine dependency hygiene, not
deploy blockers — regardless of their raw CVE severity.
_Avoid_: "dev dependency" (overlaps but isn't identical; the axis that matters is *does it
reach the Production Bundle*, not which npm block declares it).

## Example dialogue

> **Dev:** "npm audit flags 17 highs and criticals — do we block the deploy?"
> **Eric:** "Which of them are in the Production Bundle?"
> **Dev:** "None. They're all Build Chain — Rollup, undici, the phantomjs stuff under
> markdown-pdf. Nothing in the Worker or in dist."
> **Eric:** "Then they're hygiene, not blockers. We build locally, no CI runs PRs, so an
> attacker would have to own a dep we install. Re-rank them as low and batch a
> `npm audit fix`. What actually reaches production?"
> **Dev:** "The Site has no CSP, Alpine loads from a CDN with no integrity check, and the
> Worker's OAuth callback uses `unsafe-inline`. Those are the real exposure."
> **Eric:** "Right — those are the ones that touch the Production Bundle. Start there."
