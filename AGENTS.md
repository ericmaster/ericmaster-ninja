# AGENTS.md — AI Agent Coding Guide

> Canonical reference for all AI coding agents (Copilot, Claude, Gemini, etc.) working on the **ericmaster-ninja** repository.

---

## Project Overview

**ericmaster-ninja** is Eric Aguayo's personal/professional website and tech blog. It is a statically generated site built with **Astro 5.x** and deployed to **Cloudflare Workers** via **Wrangler**. The site features a blog, resume, AI solutions showcase, an AI chatbot widget, and various static content pages.

- **Live URL:** `https://ericmaster.ninja` (Cloudflare Workers) / `https://ericmaster.github.io` (GitHub Pages mirror)
- **Framework:** Astro 5.x (static site generation, SSR-capable via Cloudflare adapter)
- **Styling:** Tailwind CSS v4 + Sass (legacy `global.scss` exists but `global.css` with Tailwind is canonical)
- **Interactivity:** Alpine.js v3 (loaded globally via CDN in `BaseLayout.astro`)
- **Deployment:** Cloudflare Workers (`wrangler deploy`)
- **Package manager:** npm

---

## Technology Stack & Constraints

| Layer             | Technology                                | Notes                                                       |
| ----------------- | ----------------------------------------- | ----------------------------------------------------------- |
| Framework         | Astro 5.x                                | Follow official Astro docs and patterns only                 |
| Styling           | Tailwind CSS v4 (`@tailwindcss/vite`)     | All styling via Tailwind utility classes                     |
| Typography        | Poppins (`@fontsource/poppins`)           | Custom `@font-face` declarations in `global.css`             |
| Icons             | `astro-icon`, `unplugin-icons`, Iconify   | Heroicons, MDI, Simple Icons sets available                  |
| Client JS         | Alpine.js v3 (CDN)                        | **Do NOT use React, Vue, or Svelte**                        |
| Markdown          | `marked` library                          | Used for runtime markdown rendering                          |
| Deployment        | Cloudflare Workers + Wrangler             | Static assets served from `./dist`                           |
| TypeScript        | Strict mode (`astro/tsconfigs/strict`)    | Worker types via `@cloudflare/workers-types`                 |

### Hard Rules

- **No React, Vue, or Svelte** — all client-side interactivity must use Alpine.js
- **Do not add Alpine.js CDN** in individual components — it is loaded globally in `BaseLayout.astro`
- **All styling must use Tailwind CSS** — no inline styles or custom CSS outside of `global.css`
- **Astro 5.x patterns only** — verify against official Astro documentation before applying

---

## Directory Structure

```
ericmaster-ninja/
├── .github/
│   ├── copilot-instructions.md     # GitHub Copilot-specific instructions
│   └── prompts/
│       └── new-post.prompt.md      # Reusable prompt for blog post generation
├── public/
│   ├── assets/
│   │   ├── constellation.js        # Canvas background animation
│   │   ├── images/                 # Blog post and site images
│   │   └── eric-anime-run.jpg      # Homepage hero image
│   ├── admin/                      # Decap CMS admin panel (if present)
│   ├── pdfs/                       # Generated PDFs from content pages
│   ├── favicon.svg
│   └── robots.txt
├── scripts/
│   ├── gen-pdfs.js                 # Converts markdown content pages to PDF
│   └── pdf-style.css               # PDF generation stylesheet
├── src/
│   ├── components/
│   │   ├── AiChatbot.astro         # AI chatbot widget (Alpine.js powered)
│   │   ├── ExpertAiSolutions.astro # AI services showcase section
│   │   ├── Footer.astro
│   │   ├── Hamburger.astro         # Mobile nav hamburger toggle
│   │   ├── Header.astro            # Sticky header with scroll behavior
│   │   ├── LatestPosts.astro       # Latest blog posts listing
│   │   ├── LinkedInBadge.astro
│   │   ├── Logo.astro
│   │   ├── Navigation.astro        # Main nav links
│   │   ├── PostTeaser.astro        # Blog post card/teaser
│   │   ├── Social.astro            # Social links
│   │   ├── ThemeIcon.astro         # Dark/light mode toggle
│   │   └── resume/                 # Resume sub-components (data-driven)
│   │       ├── ResumeCertifications.astro
│   │       ├── ResumeEducation.astro
│   │       ├── ResumeExperience.astro
│   │       ├── ResumeHeader.astro
│   │       ├── ResumeLanguages.astro
│   │       ├── ResumeLeadership.astro
│   │       ├── ResumeProjects.astro
│   │       ├── ResumeSkills.astro
│   │       └── ResumeSummary.astro
│   ├── content.config.ts           # Astro content collection schema (blog)
│   ├── data/
│   │   └── resume.json             # Structured resume data (JSON)
│   ├── layouts/
│   │   ├── BaseLayout.astro        # Root HTML layout (head, header, footer, Alpine)
│   │   └── MarkdownPostLayout.astro # Blog post layout with frontmatter rendering
│   ├── lib/
│   │   ├── blogUtils.ts            # Blog post fetching/sorting utilities
│   │   ├── ChatServiceMock.ts      # AI chatbot mock service (keyword/fuzzy matching)
│   │   └── dateUtils.ts            # Date formatting utilities
│   ├── pages/
│   │   ├── index.astro             # Homepage
│   │   ├── about.astro             # About page
│   │   ├── blog.astro              # Blog listing page
│   │   ├── resources.astro         # Resources page
│   │   ├── resume.astro            # Resume page (reads from resume.json)
│   │   ├── work.astro              # Work/portfolio page
│   │   ├── sitemap.xml.ts          # Dynamic sitemap generator
│   │   ├── content/
│   │   │   ├── pages/              # Markdown content fragments for static pages
│   │   │   │   ├── home-content.md
│   │   │   │   ├── about-content.md
│   │   │   │   ├── blog-content.md
│   │   │   │   ├── resources-content.md
│   │   │   │   └── work-content.md
│   │   │   └── resume.md           # Resume markdown (raw content)
│   │   ├── posts/                  # Blog posts (markdown with frontmatter)
│   │   └── tags/
│   │       └── [tag].astro         # Dynamic tag pages
│   ├── styles/
│   │   ├── global.css              # PRIMARY stylesheet (Tailwind + custom layers)
│   │   └── global.scss             # Legacy SCSS (kept for reference, not canonical)
│   └── images/                     # Astro-optimized images (if any)
├── worker/
│   └── index.ts                    # Cloudflare Worker entry (OAuth + routing)
├── astro.config.mjs                # Astro configuration
├── wrangler.jsonc                  # Cloudflare Wrangler config
├── tsconfig.json                   # TypeScript configuration
└── package.json
```

---

## Coding Conventions

### Components

- All components go in `src/components/` and follow [Astro component conventions](https://docs.astro.build/en/basics/astro-components/).
- Use `{...Astro.props}` to forward dynamic attributes (especially for Alpine.js bindings).
- For UI interactivity (toggles, modals, dropdowns), use Alpine.js `x-data`, `x-show`, `@click`, etc.
- Keep components focused — one responsibility per component.

### Pages

- All pages go in `src/pages/`.
- Every page uses `BaseLayout` (or `MarkdownPostLayout` for blog posts) as its root layout.
- Static page content is stored as markdown fragments in `src/pages/content/pages/` and imported via Astro's `Content` component.

### Blog Posts

- Blog posts are markdown files in `src/pages/posts/`.
- Every post **must** include the frontmatter schema defined in `src/content.config.ts`:
  - `title`, `slug`, `description`, `pubDate`, `published`, `tags`, `image` (url + alt)
  - Optional: `updatedDate`, `author`
- `layout` must be `../../layouts/MarkdownPostLayout.astro`.
- New posts should have `published: false` until ready.
- Use `assets/images/dev.jpg` as the default image unless a specific image exists.
- See `.github/prompts/new-post.prompt.md` for the full blog post creation workflow.

### Content Collections

- The blog collection is defined in `src/content.config.ts` using `glob` loader.
- Schema must only include fields present in actual markdown frontmatter — **do not add speculative fields**.
- Use `src/lib/blogUtils.ts` → `getPosts(limit?)` to fetch posts (filters unpublished, sorts by date).

### Utility Functions

- All complex/reusable logic belongs in `src/lib/` — never inline in components.
- Avoid code duplication; consolidate shared logic into parameterized functions.
- Existing utilities: `blogUtils.ts` (post fetching), `dateUtils.ts` (date formatting), `ChatServiceMock.ts` (chatbot).

### Styling

- `src/styles/global.css` is the **canonical stylesheet** — it uses Tailwind v4's new CSS-first config with `@import "tailwindcss"`, `@layer base/components/utilities`, and `@theme`.
- Font: Poppins (200, 400, 600, 700 weights) loaded via `@fontsource/poppins`.
- Dark mode: uses `.dark` class on `<html>` (toggled by `ThemeIcon.astro`).
- `global.scss` is a legacy file — **do not extend it**; use `global.css` instead.

### Images

- All images go in `public/assets/images/`.
- Reference images in frontmatter/templates with paths relative to the public root (e.g., `assets/images/dev.jpg` or `/assets/images/dev.jpg`).

---

## Deployment

### Development

```bash
npm run dev                          # Local dev server
npm run dev -- --host 0.0.0.0        # Expose on LAN (reverse proxy)
```

### Preview (Cloudflare local)

```bash
npx wrangler dev --ip 0.0.0.0 --env development
```

### Production Deploy

```bash
npm run build                        # Build static site to ./dist
npx wrangler deploy                  # Deploy to Cloudflare Workers
```

### PDF Generation

```bash
npm run pdfs                         # Generate PDFs from content markdown
```

---

## Worker / Edge Functions

The Cloudflare Worker (`worker/index.ts`) handles:

1. **`/api/auth`** — GitHub OAuth flow (for Decap CMS authentication)
2. **`/ai-cheatsheets`** — Proxies to GitHub Pages
3. All other routes → `404` (static assets served directly from `./dist`)

Environment variables required: `GH_CLIENT_ID`, `GH_CLIENT_SECRET`.

---

## AI Chatbot

The site includes a client-side AI chatbot widget (`AiChatbot.astro`) powered by `ChatServiceMock.ts`. Key behavior:

- Keyword-based intent detection with fuzzy matching (Levenshtein distance)
- Limits to 3 exchanges before redirecting to WhatsApp
- Categories: auditor, hiring, SME, privacy, cost
- Falls back to WhatsApp CTA for complex inquiries

---

## SEO & Sitemap

- `sitemap.xml.ts` dynamically generates a sitemap from static pages + published blog posts.
- All pages should have proper `<title>` tags (set via `pageTitle` prop in `BaseLayout`).
- External links in blog posts auto-open in new tabs (`MarkdownPostLayout.astro`).

## AI Context & MCP Servers

The following MCP (Model Context Protocol) servers are configured for this workspace to enhance AI knowledge:

- **Astro Docs**: Real-time access to the latest Astro 5.x documentation.
  - **URL**: `https://mcp.docs.astro.build/mcp`
  - **Status**: Configured for Antigravity and Claude Code.
  - **Usage**: Tools like Claude and Antigravity can now search official docs directly for accurately building the site.

---

## Key Patterns to Follow

1. **Mobile-first, responsive design** — the site works on all devices.
2. **Clean URLs** — Astro file-based routing, no trailing slashes needed.
3. **Data-driven resume** — resume page reads from `src/data/resume.json`, not hardcoded HTML.
4. **Content separation** — page prose lives in `src/pages/content/pages/*.md`, not inline in `.astro` files.
5. **Alpine.js for interactivity** — `x-data` on parent elements, event handlers via `@click`, `x-show`, etc.
6. **Constellation background** — animated canvas (`public/assets/constellation.js`) loaded in `BaseLayout`.
