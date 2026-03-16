---
mode: agent
description: Generate a new blog post draft. Provide a topic to generate full content, or provide full content to review/tweak it.
---

You are helping create a new blog post draft for an Astro-based personal tech blog.

## Instructions

1. **If the user provides full content:** Present the content back to them and ask if the user has not already mentioned: *"Would you like to keep this content as-is, or should I tweak it (improve clarity, tone, structure, or SEO)?"* Apply their choice before generating the file.

2. **If the user provides only a topic:** Generate a complete, high-quality blog post on that topic. The post should be:
   - Written in a clear, approachable technical style (similar to the existing posts in `src/pages/posts/`)
   - Structured with a brief intro, multiple `##` sections, code blocks where relevant, and a short conclusion
   - Informative, practical, and aimed at developers familiar with cloud/DevOps/AI/web technologies

## File Output

Create the new post at:
```
src/pages/posts/<slug>.md
```

Where `<slug>` is the kebab-case version of the title.

## Frontmatter Schema

Every post **must** include this exact frontmatter structure (match the field order below):

```yaml
---
layout: ../../layouts/MarkdownPostLayout.astro
title: "<Full Title Here>"
published: false
tags:
  - <tag1>
  - <tag2>
  - <tag3>
slug: <kebab-case-title>
pubDate: <ISO 8601 date, e.g. 2026-03-16T10:00:00.000Z>
image:
  url: assets/images/dev.jpg
  alt: <short descriptive alt text for the image>
description: <2–3 sentence SEO-friendly summary of the post>
---
```

### Field rules:
- `layout`: always `../../layouts/MarkdownPostLayout.astro`
- `title`: title-cased, quoted string
- `published`: always `false` for a draft
- `tags`: 3–8 relevant lowercase or title-case tags based on the topic
- `slug`: kebab-case, matches the filename (without `.md`)
- `pubDate`: use today's date in ISO 8601 UTC format
- `image.url`: always `assets/images/dev.jpg` (default template image)
- `image.alt`: a concise, descriptive alt text related to the post topic
- `description`: an SEO-friendly, 2–3 sentence summary; avoid generic phrasing

## Existing Post Examples (for reference)

- [delivering-what-matters-the-new-standard-for-ai-era-web-experiences.md](src/pages/posts/delivering-what-matters-the-new-standard-for-ai-era-web-experiences.md)
- [deploy-your-statically-generated-site-to-a-cloudflare-worker.md](src/pages/posts/deploy-your-statically-generated-site-to-a-cloudflare-worker.md)
- [dont-learn-claude-code-learn-this-instead.md](src/pages/posts/dont-learn-claude-code-learn-this-instead.md)

## Content Guidelines

- Start the body with a `# Title` H1 heading (same as the frontmatter `title`)
- Use `##` for main sections and `###` for subsections
- Use fenced code blocks with a language identifier (e.g., ` ```bash `, ` ```yaml `, ` ```ts `)
- Keep paragraphs concise; prefer short sentences
- Do not add author attribution or "draft" notices in the body text
- The tone should be confident and practical, written for experienced developers
