# Spec — Resume Positioning

## Purpose

Define the bilingual, data-driven résumé contract for `/resume` and `/es/resume`.
The JSON sources are the SSOT for the rendered routes. The v1 umbrella headline
is a truthful generalist positioning: broad technical delivery plus customer and
business outcomes. AI/agentic work is a differentiator, not a prerequisite.

## Owns

- `src/data/resume.json`
- `src/data/resume.es.json`
- `src/pages/resume.astro`
- `src/pages/es/resume.astro`
- `src/pages/content/resume.md`
- `tests/resume-data.test.mjs`
- public generated résumé artifact `public/pdfs/resume.pdf` produced from `src/pages/content/resume.md`
- absence of the retired static file `public/Eric Aguayo Resume.pdf`

## Responsibilities & functional contract

### Headlines

| Locale | `basics.headline` |
|---|---|
| English | `Senior Solutions & Implementation Engineer` |
| Spanish | `Ingeniero Senior de Soluciones e Implementación` |

Spanish must be idiomatic and semantically equivalent. Neither locale may contain
“transitioning to Agentic Ops Engineer”, “en transición a Ingeniero de Agentic
Ops”, or “en transición hacia Agentic Ops”.

### Summary

Both `basics.summary` fields must state all of the following, without invented
employers, dates, products, or metrics:

- 15+ years of experience (`15+` in English; `más de 15` in Spanish)
- full-stack / platform delivery
- integrations
- cloud / AI / automation
- client or customer discovery
- cross-functional leadership
- business outcomes
- AI as a differentiator, not a prerequisite for target roles

### Chronology

`experience`, `education`, `leadership`, `certifications`, and `projects` keep
factual company names, role titles, locations, and date ranges. English and
Spanish experience rows stay aligned by `(company, date)` after normalizing
Presente→Present and Ene→Jan. Each designated current narrative — Nimblersoft
`Feb 2025 – Present` and Independent Developer / Contractor `Feb 2025 – Present`
— must separately include technical-depth language and customer or business
outcome language in both locales. Outcome phrasing is responsibility- or
evidence-oriented; it must not assert unsubstantiated causal metrics.

### Skills

Skill groups keep the same order in both locales. Delivery and platform groups
precede AI groups. Both locales include these role-family keyword pairs
somewhere in skill names or keywords:

| English | Spanish |
|---|---|
| Implementation | Implementación |
| Integrations | Integraciones |
| Solution Design | Diseño de Soluciones |
| Platform Delivery | Entrega de Plataforma |

### Public static artifacts

`src/pages/content/resume.md` and the kept generated public PDF
`public/pdfs/resume.pdf` must state the English v1 headline and must omit the
forbidden transition phrasing.

The hand-authored file `public/Eric Aguayo Resume.pdf` is retired. No public
route or navigation references it, so it must not be present under `public/`.
No other public résumé PDF may exist unless it satisfies the same v1
conditions. If a generated artifact cannot be kept in agreement, it must be
removed from public assets, navigation, and references.

### Routes

`resume.astro` imports `src/data/resume.json`. `es/resume.astro` imports
`src/data/resume.es.json`. Neither route source may contain a literal headline
string or literal summary positioning text; both render `basics.headline` and
`basics.summary` from the imported JSON.

## Non-goals

- Deploying the Site
- Changing About, blog, or other non-résumé pages
- Inventing career claims
- Putting contacts or raw résumé prose into plan evidence

## Traceability

- Tests: `tests/resume-data.test.mjs`
- Verification: Site `npm test`, `npm run build`, and `npm run pdfs` when a
  public generated artifact remains; visual/print inspection of `/resume` and
  `/es/resume`
