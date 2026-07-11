# docgen — Personal letterhead document generator

A small, dependency-light generator that wraps arbitrary **markdown-rendered
body content** in Eric Aguayo's personal-branded "letterhead" chrome (header,
brand-info, doc-meta, parties, signatures, footer/disclaimer) with A4 print
styling.

The visual style is borrowed from the original one-off NDA
(`NDA-nimblersoft-flourish-and-grace.html`) — the A4 `@page` geometry, the
gradient border rule, the `background-clip: text` wordmark treatment, and the
print `@media` block — but the identity is **Eric Aguayo's personal brand**, not
Nimblersoft. There is no residual Nimblersoft logo, name, or contact.

> **Security model (MVP).** Documents are authored privately and handed off as
> PDF — nothing is served online. Gated online delivery (R2) is deferred to a
> later phase. Keep generated output out of the deployed site.
>
> **No sanitization.** The markdown body is rendered with `marked` and
> injected into the template **as raw HTML** (`{{{body}}}`, unescaped) — any
> HTML written or embedded in the source markdown passes through verbatim.
> This is intentional (it lets authored documents use raw HTML where markdown
> falls short) but means `render.mjs` must only ever be pointed at markdown
> you personally authored or fully trust. Never render third-party or
> user-submitted markdown through this pipeline.

## Files

| Path                          | Purpose                                                        |
| ----------------------------- | ------------------------------------------------------------- |
| `templates/letterhead.html`   | The parameterized template (placeholder tokens + body slot).  |
| `render.mjs`                  | Renders a frontmatter markdown doc into the template.         |
| `samples/sample-nda.md`       | A sample document exercising every token.                     |
| `dist/`                       | Rendered HTML output (git-ignored working area).              |
| `../scripts/gen-doc-pdf.js`   | Render → branded PDF via Cloudflare Browser Rendering.        |
| `out/`                        | Generated PDFs (git-ignored hand-off area).                   |

## Usage

### HTML (manual print)

```bash
# Render a document to HTML
node docgen/render.mjs docgen/samples/sample-nda.md docgen/dist/sample-nda.html

# Then open docgen/dist/sample-nda.html in a browser and use Print → A4 to
# produce the hand-off PDF. Check the print preview matches the letterhead
# layout (gradient rules, navy wordmark, doc-meta, signatures, disclaimer).
```

### PDF (automated, Cloudflare Browser Rendering)

```bash
# Render md → branded PDF straight to docgen/out/<name>.pdf
npm run doc:pdf -- docgen/samples/sample-nda.md
npm run doc:pdf -- <path-to.md> [out.pdf]
```

`npm run doc:pdf` routes through the **central trusted runner** in the ops repo
(`$OPS_HOME/scripts/trusted-run.sh`, default `~/nimbler-ops`). The runner is itself hash-pinned
(it verifies its own SHA-256 against the read-only `nimbler-ops/scripts/trusted-run.sha256` before
touching secrets); it then confirms `scripts/gen-doc-pdf.js` is **path-whitelisted** in the ops repo's
central registry (`nimbler-ops/prompts/state/projects.json`, under this project's `trusted_scripts[]`,
keyed by `(repo, path)`) and injects
`CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` from **Infisical** (project *Nimblersoft Web*,
env `dev`) — the token is never hardcoded or committed. The PDF layout is driven by the
template's `@page` A4 CSS and print `@media` block (gradients print because the template opts
into `print-color-adjust: exact`).

> **Prerequisites.** Cloudflare Browser Rendering requires a **Workers Paid plan** and an
> **API token scoped for Browser Rendering**. A 401/403 from the endpoint means the plan or
> token scope is missing. Output goes to `docgen/out/` (git-ignored — confidential, never
> committed or served). Set `OPS_HOME` if the ops repo is not at `~/nimbler-ops`.
>
> **Trust model.** The *runner* (`trusted-run.sh`) is the hash-pinned anchor, not this script —
> `gen-doc-pdf.js` is only path-whitelisted in the ops repo. So editing this script won't be caught
> by a hash; the security gate is that its path was added to the ops-repo registry by a human review
> (a product-side change can't self-approve — the registry lives in the ops repo). Editing the *runner*
> in the ops repo requires re-pinning `nimbler-ops/scripts/trusted-run.sha256`, or both its self-check
> and the orchestrator's control-plane check fail closed and no secrets are pulled.

The renderer pulls the brand-info block (website / email / phone / location)
from `src/data/resume.json` `basics`, so the contact identity stays in a single
source of truth.

## Frontmatter schema

The document is a markdown file with a YAML-style frontmatter block. Scalars use
`key: value`; arrays/objects use **JSON flow syntax** on a single line (a small
dependency-free subset — full YAML is not parsed).

| Token        | Type              | Required | Description                                                            |
| ------------ | ----------------- | -------- | ---------------------------------------------------------------------- |
| `type`       | string            | no       | Document class shown above the title (e.g. `Non-Disclosure Agreement`).|
| `lang`       | string            | no       | `<html lang>` value. Defaults to `en`.                                 |
| `title`      | string            | yes      | Document title (the main heading in doc-meta).                         |
| `subtitle`   | string            | no       | Secondary line under the title.                                        |
| `ref`        | string            | no       | Reference / document number shown in the ref line.                     |
| `date`       | string            | no       | Human-formatted date shown in the ref line.                            |
| `tagline`    | string            | no       | Short wordmark tagline. Defaults to Eric's headline. **Eric to finalize.** |
| `parties`    | array of objects  | no       | `{ role, name, detail }` — rendered as party cards.                    |
| `signatures` | array of objects  | no       | `{ name, role }` — rendered as signature lines.                        |
| `disclaimer` | string            | no       | Confidentiality/legal note in the footer.                              |

Brand-info tokens (`website`, `email`, `phone`, `location`) are **not** set in
frontmatter — they come from `resume.json`.

### Minimal example

```markdown
---
type: Letter of Intent
title: Letter of Intent
date: July 9, 2026
signatures: [{ "name": "Eric Aguayo", "role": "Author" }]
---

Body content in **markdown**. Headings, lists, tables, blockquotes and code are
all styled on-brand.
```

## Body styling

Standard markdown elements (`h1`–`h4`, `p`, `ul`, `ol`, `blockquote`, `table`,
`code`, `pre`, `hr`, links) are styled on-brand inside the body slot.

The original NDA numbered-clause treatment is preserved as an **opt-in class**:
add `class="clauses"` to an `<ol>` in the body to get the framed clause
numbering; plain `<ol>`/`<ul>` get generic on-brand list styling.

## Brand notes / open items

- **Print color** is fixed to brand navy `#405282` on white paper (no dark
  mode). The wordmark falls back to a solid navy fill in print.
- The personal mark is Eric's logo from `src/components/Logo.astro` /
  `public/favicon.svg`, inlined into the template.
- **Eric to finalize** the wordmark tagline text and confirm which email/phone
  to expose. Current values come from `resume.json`
  (`eric7master@gmail.com` / `+593983337611`).
