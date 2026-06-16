---
layout: ../../layouts/PageLayout.astro
title: "Using SilverBullet AI"
slug: "silverbullet-ai"
description: "Practical cheatsheet for the silverbullet-ai plug — AI chat, semantic search, and MCP inside SilverBullet."
tags: ["silverbullet", "ai", "knowledge-base", "cheatsheet"]
category: "Resources"
---

# Using SilverBullet AI

SilverBullet AI (`silverbullet-ai` plug) adds LLM chat, text generation, embeddings-based semantic search, and MCP tool support directly inside [SilverBullet](https://silverbullet.md), the self-hosted Markdown knowledge base. This cheatsheet covers day-to-day use.

## Setup at a glance

- **Plug:** `silverbullet-ai` (drop `silverbullet-ai.plug.js` into the space's `_plug/` folder — SilverBullet auto-loads it).
- **Provider config** lives in a `space-lua` block (e.g. in `CONFIG.md` or a dedicated `_config/` page):

  ```lua
  config.set("ai.providers", {
    openrouter = {
      provider = "openai",                       -- OpenAI-compatible API shape
      apiKey = "sk-or-...",                       -- keep this out of git; inject at runtime
      baseUrl = "https://openrouter.ai/api/v1",
      preferredModels = {
        "anthropic/claude-sonnet-4-6",
        "google/gemini-2.5-flash",
      },
    },
  })
  config.set("ai.defaultTextModel", "openrouter:anthropic/claude-sonnet-4-6")
  config.set("ai.defaultEmbeddingModel", "openrouter:openai/text-embedding-3-small")
  ```

- **Keep the API key out of version control.** Inject it at container start (e.g. fetch from a secrets manager and write the provider config page), rather than committing it.

## Core commands (Cmd/Ctrl-/ → command palette)

| Command | What it does |
|---|---|
| `AI: Chat on Current Page` | Opens a chat that uses the current note as context |
| `AI: Generate text` / `AI: Execute AI Prompt` | Runs a prompt and inserts the result at the cursor |
| `AI: Summarize Note` | Summarizes the current page |
| `AI: Index Space for AI` | Builds/rebuilds the vector embeddings index (required before semantic search) |
| `AI: Search Space (Semantic)` | Vector similarity search across all notes |
| `AI: Connectivity Test` | Verifies the provider (and any MCP servers) are reachable |
| `AI: Select Text Model from Config` | Switch the active model on the fly |

## Semantic search workflow

1. Set `ai.defaultEmbeddingModel` to an embedding model.
2. Run **`AI: Index Space for AI`** once (re-run after large content changes).
3. Use **`AI: Search Space (Semantic)`** to find conceptually-related notes — not just keyword matches.

> Embeddings cost tokens on every (re)index. For large spaces, re-index deliberately rather than on every edit.

## Chat with page context

`AI: Chat on Current Page` pulls the current note into the prompt. To also pull in semantically-related notes automatically, enable embeddings in chat:

```lua
config.set("ai.chat", {
  renderMarkdown = true,
  useEmbeddings = true,   -- inject relevant pages via the embeddings index
})
```

## MCP support

SilverBullet AI can both **expose** its tools and **consume** external MCP servers.

- **As an MCP server** — bridge SilverBullet's tools to clients like Claude Code via the `silverbullet-ai-mcp` npm package:

  ```bash
  claude mcp add silverbullet \
    --env SB_URL=http://localhost:3000 \
    -- npx -y silverbullet-ai-mcp
  ```

  Typical tools exposed: `search`, `read_page`, `write_page`, `list_pages`, `semantic_search`.

- **As an MCP client** — let SilverBullet's chat call external MCP servers:

  ```lua
  config.set("ai.mcpServers", {
    myserver = {
      url = "https://my-mcp.example.com/mcp",   -- HTTP streamable transport
      trusted = false,                           -- true = auto-run tools w/o per-call approval
      headers = { Authorization = "Bearer TOKEN" },
    },
  })
  config.set("ai.chat.enableTools", true)
  ```

## REST API (for agents/scripts)

SilverBullet exposes pages over HTTP (Basic Auth by default):

```bash
# Read a page (raw Markdown)
curl -s "$SB_URL/page/Models" -H "Authorization: Basic $B64"

# Upsert a page
curl -s -X PUT "$SB_URL/page/Notes/my-note" \
  -H "Authorization: Basic $B64" \
  -H "Content-Type: text/plain" \
  --data "# My Note"$'\n\n'"Body here."

# Full-text search
curl -s "$SB_URL/search?q=openrouter" -H "Authorization: Basic $B64"
```

## Tips

- **Model routing:** with OpenRouter you can list cheap + capable models in `preferredModels` and switch via `AI: Select Text Model from Config`.
- **Redaction / rewriting:** select text, then `AI: Generate text` with an instruction like "redact PII from the following" to transform in place.
- **Provider-agnostic:** any OpenAI-compatible endpoint works by setting `provider = "openai"` + a custom `baseUrl` (OpenRouter, local Ollama via its OpenAI shim, etc.).
- **Docs:** https://ai.silverbullet.md
