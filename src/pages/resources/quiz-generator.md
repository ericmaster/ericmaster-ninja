---
layout: ../../layouts/PageLayout.astro
title: "Quiz Generator"
slug: "quiz-generator"
description: "AI-powered quiz generator — upload a document, get MCQs grounded in its content via RAG on Cloudflare Workers."
tags: ["cloudflare", "sveltekit", "ai", "rag", "quiz"]
category: "Resources"
---

# Quiz Generator

**Live:** https://quiz-generator.ericmaster.ninja

An AI-powered quiz app that turns uploaded documents into multiple-choice quizzes grounded in their content. Upload a PDF or text file, wait for it to process, pick a topic + difficulty, and get a set of MCQs you can save and revisit.

## Stack

- **Frontend:** SvelteKit 5 + Svelte 5, deployed via `@sveltejs/adapter-cloudflare`
- **Runtime:** Cloudflare Workers (free tier — no Queues, ingest uses `ctx.waitUntil`)
- **Storage:** D1 (SQLite with FTS5 virtual table for keyword search), R2 (raw document blobs)
- **Vectors:** Cloudflare Vectorize (1024-dim cosine, `@cf/baai/bge-m3` embeddings via Workers AI)
- **LLM:** OpenRouter (multi-model, capped to top-3 selections)
- **Auth:** Better Auth (email/password; OAuth-ready)

## How it works

1. **Ingest** — document uploaded to R2 + D1; background `waitUntil` job chunks it, generates embeddings via Workers AI, upserts vectors into Vectorize, and extracts topics via OpenRouter.
2. **Retrieval** — hybrid search: Vectorize semantic ANN + D1 FTS5 keyword, fused with Reciprocal Rank Fusion (RRF).
3. **Generation** — retrieved chunks + topic/difficulty prompt → OpenRouter → MCQs rendered in the UI.

## Source

Private repo. Deployed to Cloudflare account `71f942c5…` — D1 `quiz-generator-db`, R2 `quiz-generator-docs`, Vectorize index `quiz-generator-chunks`.
