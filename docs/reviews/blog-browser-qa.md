# Browser acceptance of recovered mobile refresh

Plan: preserve the approved source, run tests/build/fidelity, exercise only public static routes in isolated CI, inspect captured pixels, then assess release gates. No redesign or production changes.

Independent Codex plan and code review found no blockers for CI. Relevant official guidance: https://docs.astro.build/en/guides/deploy/ and https://playwright.dev/docs/ci-intro . Existing temporary Codex fallback applies; this is not an AGY review.

The test-only PDF selector correction keeps nested public paths in scope but excludes checkout-parent names. Reproduction: running the original test from a directory named personal-site-resume misclassified a non-résumé PDF; corrected suite passes 68/68 without changing PDFs.

CI serves an allowlist of public pages and static media/assets, applies the existing global CSP, and rejects private/API routes and mutation methods. Browser requests outside the local server are aborted. Screenshots and a byte manifest are the only artifacts; no whole dist, source, auth, private or unlisted route content is uploaded. Playwright 1.56.1 is installed from the official npm package in an ephemeral runner directory and removed with the runner.

Current limits: no authenticated/Worker acceptance; blocked external integrations are not verified; article language selector still changes prefix without mapping translated slugs. Current-build visual inspection and production parity/deployment remain pending until receipts are recorded.
