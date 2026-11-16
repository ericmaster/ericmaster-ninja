# HANDOFF — pending blog delivery

Updated 2026-11-15. This file owns in-progress and pending work; implemented behavior and verification are documented in [blog-language-release](docs/plans/blog-language-release.md).

## Active outcome

Apply the approved mobile-first personal-brand refresh and correct mixed English/Spanish blog listings. Eric explicitly approved applying the preview and requested the locale fix on 2026-11-15; further design approval or preview login is not the current blocker.

## Recoverable checkpoint

- Repository: `ericmaster/ericmaster-ninja`; delivery branch: `chiku/blog-recovery-mobile`.
- Combined implementation checkpoint: `98c4e8fa` (remote); source reconstructed from approved compiled preview and four existing public articles, not recovered original source. Earlier `chiku/blog-language-fix` is superseded for this combined delivery.
- Original local-only `chiku/mobile-brand-refresh` checkout was lost. Do not resume from its obsolete local paths or treat it as remotely backed up.
- Approved private preview: https://ericmaster-mobile-review-20261115.ericmaster581967.chatgpt.site/ . It contains homepage EN/ES only, not a full-site acceptance environment. Preserve its privacy and access configuration.
- Recorded implementation checks: 68 tests, 158-page build, CSP and four-article fidelity checks passed. Independent review's timestamp finding was corrected. These are not proof of production deployment or new-build visual acceptance.

## Next minimal release phase

1. Reconcile branch tip and active ownership before editing; preserve other workers' changes.
2. Obtain AGY review of sanitized code/artifacts. Previous review of the lost original refresh does not substitute for review of reconstructed code. AGY was unavailable in the current environment; do not claim this gate passed.
3. Visually verify the reconstructed build at mobile and desktop sizes in EN/ES: homepage, navigation, language selector, blog listings, article and tag routes; test Back/Forward and repeated switches. Approved preview alone is insufficient.
4. Resolve project deployment credentials through supported secure access; no secrets in documentation or reviews. With reviews/checks passed, apply the authorized change, verify remote source and deployment, then verify production language filtering and preservation of all four recovered articles.
5. Report the actual live outcome and move completed details into project documentation. Keep unresolved gates here.

## Release status and boundaries

No main merge or production deployment is recorded for this delivery. The live language bug must not be reported fixed yet. Do not overwrite production from stale main, which lacked four published English articles. Preserve authentication, private/unlisted content, CSP and existing production until release checks pass. This project is independent of Trail Intent admin/beta work.

## Pending follow-up: AI auditing service claim (2026-11-16)

This is a scoped observation, not authorization to change service positioning or expand the approved mobile refresh.

- Local recovery source inspected at `5eddb55`, `src/i18n/ui.ts:59`: “Human-in-the-loop certification for technical, medical, and legal AI outputs to ensure absolute reliability.”
- Spanish at `src/i18n/ui.ts:138`: “Certificación con supervisión humana para resultados de IA técnicos, médicos y legales, garantizando una fiabilidad absoluta.”
- `ExpertAiSolutions.astro` consumes `expertAi.service1.description` and outputs it in a service-card paragraph; `src/pages/work.astro` and `src/pages/es/work.astro` render that component.
- Each exact claim appears once in the corresponding existing local compiled `dist/work/index.html` or `dist/es/work/index.html`; neither appears in the homepage output. This verifies generated markup only, not fresh visual acceptance or current production. No fresh build was run for this documentation-only review.
- The absolute guarantee and certification are not substantiated by this investigation. No copy was changed.

Suggested moderated ES: “Revisión humana de resultados de IA para ayudar a detectar errores, contrastar afirmaciones y documentar limitaciones”.

Suggested moderated EN: “Human review of AI outputs to help identify errors, check claims, and document limitations.”

An independent wording review supports this alternative. It removes unverified certification/guarantees and does not imply medical/legal credentials. Because removing explicit sectors changes service positioning, confirm the intended scope with Eric before adopting it. If sectors are retained, a narrower alternative is “Human review of technical, medical, and legal AI outputs to identify potential errors and document limitations.” / “Revisión humana de resultados de IA técnicos, médicos y legales para identificar posibles errores y documentar limitaciones”.

AGY review remains pending: no matching connector or executable was available in the review environment. Do not report AGY approval. Keep this follow-up separate from the mobile refresh; if a copy revision is approved, limit the edit to both localized descriptions, obtain AGY review, and verify work-page markup and visual output before publication.
