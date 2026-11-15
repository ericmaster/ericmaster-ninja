# Blog language and approved mobile refresh

## Approved outcome

Apply the reviewed mobile-first homepage design and show only the selected language in blog listings (Eric, 2026-11-15).

## Minimal release plan

1. Recover the approved source and reconcile the deployed content before publishing.
2. Make locale selection explicit and fail closed rather than falling back to another language. Add unit and built-page checks.
3. Obtain independent and AGY review, check mobile EN/ES navigation, build/CSP, then deploy and verify production.

## Current gate

The approved private preview is recoverable as compiled HTML/assets, not the original Astro source. Production contains four English translations absent from every fetched remote branch: `what-no-one-understands-no-one-maintains-part-1`, `if-you-dont-practice-them-they-fade`, `a-mistake-in-your-prompt-can-lead-to-unwanted-results`, and `the-expensive-part-of-an-agent-is-attention`. Do not deploy this checkout over production until their source and the approved design source are recovered/reconciled. AGY and project credential loading are unavailable in this workspace. No production change has been made.

The isolated locale patch below is hardening for integration into the recovered source, not a claim that the observed production bug has been fixed. Main already filters English by default; production differs.

## Verification of isolated patch

Independent reviewer found no critical issues. All 59 tests pass, build generates 147 pages, and CSP hash checks pass. Generated home and blog cards were checked against content frontmatter in both languages. This does not validate current production, mobile interaction, or recover the absent source. Production release remains blocked; keep the approved preview and published articles unchanged.
