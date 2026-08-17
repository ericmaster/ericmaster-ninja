# Roadmap

Pending work, lowest-urgency last. Security context lives in [SECURITY_PLAN.md](./SECURITY_PLAN.md);
terminology in [CONTEXT.md](./CONTEXT.md); decisions in [docs/adr/](./docs/adr/).

## Verify (manual, quick)

- [ ] **Decap CMS end-to-end login** — header-level CSP is verified live, but click through
      `/admin` → GitHub OAuth popup → token round-trip once in a browser to confirm the full
      flow (depends on Worker secrets `GH_CLIENT_ID` / `GH_CLIENT_SECRET`).

## Phase 3 — Build Chain dependency hygiene (no urgency)

None of these reach the Production Bundle; builds run locally on a trusted machine with no CI.
Treat as a maintenance pass, not a deploy blocker.

- [ ] `npm pkg set overrides='{"form-data": ">=4.0.3", "axios": ">=1.16.1"}'` + `npm audit fix`
- [ ] `npm install @iconify/tools@5.0.12 unplugin-icons@23.0.1` (drops axios/form-data, lifts svgo)
- [ ] `npm install wrangler@^4.95.0 @cloudflare/workers-types@^4.20260526.1 --save-dev`
      (wrangler is currently 4.74.0; brings undici/miniflare fixes)
- [ ] `npm update remark-math` (verify a patched release exists first)
- [ ] Confirm clean: `npm audit --audit-level=high`
- [ ] Stay on Astro 5.x (Option A) unless a feature requires v6 — no CVE forces the migration.

## Phase 4 — Optional / belt-and-suspenders

- [ ] Replace `markdown-pdf` (deprecated phantomjs chain) **only if `npm run pdfs` is still used** —
      e.g. `puppeteer-core` + system headless Chrome, or drop the script if obsolete.
- [ ] Pin the npm registry explicitly: `npm config set registry https://registry.npmjs.org/`
- [ ] Sanitize the `resume.json` `set:html` output (`ResumeSummary.astro`, `ResumeExperience.astro`)
      before introducing any user-supplied markdown anywhere — repo-controlled today, so LOW risk.

