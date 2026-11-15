# Blog language and approved mobile refresh

## Approved outcome and minimal phases

Eric approved applying the reviewed mobile-first homepage and fixing mixed-language listings on 2026-11-15.

1. Reconcile published content and reconstruct approved design without losing articles.
2. Test selected-language listings and publication fidelity; obtain independent and AGY review.
3. Verify mobile UI, deploy with project credentials, and check production. No production deployment has happened.

## Current implementation

The four English translations missing from GitHub were reconstructed from their public pages. Bodies are HTML embedded in Markdown to avoid a lossy reverse-Markdown conversion. Titles, descriptions, images, tags and original publication timestamps are preserved. The attention article's diagram source was captured from the public page; the rendered SVG is not pasted into source. Fixtures under `tests/fixtures/recovered-blog` record URLs and captured content. These are reconstructed publication sources, NOT the lost original Markdown.

The bilingual homepage, navigation and cards were reconstructed from the approved private preview's saved compiled HTML/CSS, NOT recovered original Astro. Header and intro normalized HTML match the preview; hero text, links, classes and image attributes match. Existing inline-script bytes/CSP, authentication and non-home content remain intact.

English blog explicitly requests English. Empty locales remain empty rather than silently falling back to English. Main previously already filtered English by default; the divergent deployed source was the observed mixed-listing version.

## Verification

- 68 tests pass, including locale selection, recovered content and mobile-layout contracts.
- Combined build: 158 pages; CSP checks pass.
- `node scripts/verify-recovered-blog.mjs` passes for all four articles: complete body text, element structure, links, heading IDs, diagram source, title/description, image/tags, visible dates and original card timestamps.
- Independent review completed. Its timestamp-preservation finding was corrected and covered by assertions. No active scripts, inline event handlers or dangerous URL schemes were found in recovered article bodies.

## Release gates

AGY review, browser QA of the reconstructed mobile EN/ES flows, project credentials and production verification remain outstanding. The code is for review only; do not represent the live bug as resolved. Preserve the existing production and approved private preview until these gates pass.
