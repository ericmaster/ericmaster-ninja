# CLAUDE.md — Claude Code Instructions

> Instructions for Claude (Anthropic) when working on the **ericmaster-ninja** repository.

## Read First

**Before making any changes, read the full [AGENTS.md](./AGENTS.md) file.** It contains the canonical project architecture, directory structure, coding conventions, and technology constraints that apply to all AI agents — including you.

---

## Claude-Specific Guidelines

### General Behavior

- **Always reference `AGENTS.md`** for project structure, conventions, and hard rules before writing code.
- **Verify Astro patterns** against the [official Astro 5.x docs](https://docs.astro.build/) — do not rely on assumptions from older Astro versions.
- When uncertain about a convention, check existing files for precedent before inventing new patterns.

### Code Changes

- **Prefer minimal, targeted edits.** Do not refactor unrelated code without being asked.
- **Preserve all existing comments and docstrings** unless they are directly related to your change.
- **Test changes** by confirming the build passes (`npm run build`) before considering work complete.
- When modifying Tailwind classes, confirm they are valid Tailwind v4 utilities — the project uses the new CSS-first Tailwind configuration, not `tailwind.config.js`.

### Blog Posts

- Follow the exact frontmatter schema and content guidelines in `.github/prompts/new-post.prompt.md`.
- New posts must have `published: false`.
- Use existing posts in `src/pages/posts/` as style and tone references.

### Component Rules

- **No React, Vue, or Svelte** — use Alpine.js for all interactivity.
- Alpine.js is already loaded globally; never add another CDN script tag for it.
- Use `{...Astro.props}` to forward attributes in components receiving dynamic bindings.
- Put reusable logic in `src/lib/`, not inside components.

### Styling

- Use `src/styles/global.css` (Tailwind v4) as the single source of truth for global styles.
- Do not extend `global.scss` — it is a legacy artifact.
- Dark mode is class-based (`.dark` on `<html>`).

### Deployment

- The site deploys to Cloudflare Workers via Wrangler.
- The worker entry point is `worker/index.ts` — avoid modifying it unless explicitly asked.
- Environment secrets (`GH_CLIENT_ID`, `GH_CLIENT_SECRET`) should never be hardcoded.

### File Placement Quick Reference

| What                  | Where                                    |
| --------------------- | ---------------------------------------- |
| Pages                 | `src/pages/`                             |
| Components            | `src/components/`                        |
| Layouts               | `src/layouts/`                           |
| Blog posts            | `src/pages/posts/*.md`                   |
| Page content fragments| `src/pages/content/pages/*.md`           |
| Utility functions     | `src/lib/`                               |
| Images                | `public/assets/images/`                  |
| Resume data           | `src/data/resume.json`                   |
| Global styles         | `src/styles/global.css`                  |
| Cloudflare Worker     | `worker/index.ts`                        |
