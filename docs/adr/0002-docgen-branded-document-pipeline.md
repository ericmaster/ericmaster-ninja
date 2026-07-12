# docgen: personal-letterhead template, local PDF rendering, and private authoring

**Status:** accepted (2026-07-12)

## Context

Eric occasionally needs to hand off branded documents (NDAs, proposals, letters) under his
own personal identity. A one-off NDA (`NDA-nimblersoft-flourish-and-grace.html` — private,
confidential, never committed to this repo) already had a print-quality letterhead
treatment worth reusing: A4 `@page` geometry, a gradient border rule, a
`background-clip: text` wordmark, numbered-clause styling. Turning that into a reusable
capability meant answering four coupled questions: how to generalize a one-off styled
document into a reusable generator, where to rasterize markdown → PDF, where to author
document content without leaking anything confidential into the public
**ericmaster-ninja** repo, and how (if at all) to deliver finished documents online.

## Decision

### 1. Extract the template, re-skin to Eric's personal brand

`docgen/templates/letterhead.html` generalizes the NDA's chrome — header, brand-info,
doc-meta, party cards, numbered-clause list, signatures, footer/disclaimer — into a
parameterized wrapper (`docgen/render.mjs`) driven by YAML frontmatter over a markdown
body. All Nimblersoft identity (logo, name, contact) is removed; the numbered-clause
treatment is kept only as an **opt-in** `class="clauses"` on an `<ol>`, so new document
types get generic on-brand list styling by default instead of inheriting NDA-specific
chrome. Brand-info (website/email/phone/location) is pulled from `src/data/resume.json` so
contact identity has one source of truth. Full frontmatter schema: `docgen/README.md`.

### 2. Render HTML → PDF locally with WeasyPrint, not Cloudflare Browser Rendering

The generator originally POSTed rendered HTML to **Cloudflare Browser Rendering**,
authenticated with `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` injected by the ops
trusted runner (a path-whitelisted, hash-pinned script — the token itself never touched
this repo). That path stayed unproven in practice: it needs a Workers Paid plan plus a
Browser-Rendering-scoped token, and the available dev token 401s.

Rather than wait on the entitlement, rendering was switched to a small **local Docker
container** (`docgen/weasyprint.Dockerfile`: CPython + WeasyPrint) that rasterizes the
letterhead HTML to an A4 PDF via `docker run`. This drops Cloudflare, the trusted-runner
hop, and the CF secrets from this path entirely — `npm run doc:pdf` now needs only Docker.
Verified faithful (flexbox columns, gradients-as-backgrounds, and tables all render
correctly); only `box-shadow` and the `background-clip: text` wordmark degrade cosmetically,
since WeasyPrint is Pango-based rather than a browser engine — accepted as low-risk because
the accent borders and solid-navy print fallback keep the document legible and on-brand.

### 3. Author documents in a separate private repo via a local-only Decap CMS surface

Document *sources* (markdown + frontmatter) are confidential by default — real counter-party
names, deal terms — and must never land in the public **ericmaster-ninja** repo. Authoring
happens in `branded-docs/`, a **separate private git repo** (`ericmaster/branded-docs`)
nested inside this checkout purely for local convenience: it is `.gitignore`d here so it can
never be tracked or served by the public site, and is versioned independently to its own
private GitHub remote via `npm run docs:backup`.

The editing surface is Decap CMS (`public/docs-admin/`), served by `astro dev` and wired to
Decap's `local_backend` — a `decap-server` proxy on port 8083, started together with
`astro dev` via `npm run docs:cms` — instead of the GitHub-OAuth backend, so saves write
`branded-docs/docs/*.md` straight to local disk. No cloud round-trip, no OAuth token, and no
secret for the everyday local-authoring case. `public/_redirects` 404s `/docs-admin/*` in
production, so the surface — and its dormant `backend: github` fallback, kept valid only in
case the surface is ever intentionally exposed behind Cloudflare Access — is never reachable
on the deployed site.

### 4. Defer gated online delivery (R2) to a later phase

The MVP hand-off model is: author privately, generate a PDF locally, deliver it out-of-band
(email, etc.) — nothing is served online. A gated-delivery surface (signed/expiring links to
documents stored in Cloudflare R2) would let Eric send a URL instead of an attachment, but
adds a Worker route, an access-control model, and another place confidential content could
leak. Not justified until the MVP hand-off flow above is actually in regular use.

## Consequences

- The pipeline needs only **Docker** for `npm run doc:pdf`, and a local clone of the private
  `branded-docs` repo for authoring — no Cloudflare entitlement, no CF secrets, and no ops
  trusted runner in this path any more.
- Confidential document sources and generated PDFs are kept out of the public repo by three
  independent controls: `branded-docs/` is `.gitignore`d, `docgen/dist/` and `docgen/out/`
  are `.gitignore`d, and `/docs-admin/*` 404s in production.
- There is no gated-delivery surface yet, so hand-off is manual (Eric sends the PDF himself).
  If/when R2 delivery is built, amend this ADR in place rather than filing a superseding one.
