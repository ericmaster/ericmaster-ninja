---
layout: ../../layouts/PageLayout.astro
title: "Agent Fabric"
slug: "agent-fabric"
description: "Portable, provider-neutral agent definition and multi-harness adaptation system for AI developer tools."
tags: ["ai-agents", "cli", "go", "developer-tools", "orchestration"]
category: "Resources"
---

# Agent Fabric

**GitHub:** [https://github.com/ericmaster/agent-fabric](https://github.com/ericmaster/agent-fabric)

Agent Fabric is a portable, provider-neutral agent definition and multi-harness adaptation system. It establishes canonical role definitions in Markdown and compiles them deterministically into native configurations and prompt files for AI developer tools, including OpenCode, Kilo, Antigravity CLI, Codex, and Claude Code.

## Quick Install

Run this on Linux or macOS:

```sh
curl -fsSL https://ericmaster.ninja/agent-fabric/install | bash
```

For a headless/automated install across all harnesses:

```sh
curl -fsSL https://ericmaster.ninja/agent-fabric/install | \
  bash -s -- --all --tools opencode,kilo,agy,codex,claude --yes
```

## Key Features

- **Multi-Harness Adapters:** Translates canonical role definitions into native harness formats without vendor lock-in.
- **Manifest Tracking:** Atomic JSON state file (`.agent-fabric-manifest.json`) tracks SHA-256 hashes so updates and upgrades never overwrite user edits or customizations.
- **Portable Lifecycle Hooks:** Six portable hook events (`load-task`, `pre-plan`, `classify`, `label`, `decompose`, `post-plan`) resolved deterministically from `~/.agent-hooks/`.
- **Profile Tiers:** Abstract compute and capability tiers (`planner`, `worker`, `reviewer`, `supervisor`) mapped to provider models and reasoning effort levels.
- **Hub Ecosystem:** Integrated catalog client to discover and install community and custom agents (`agf hub install`).

## CLI Usage

```sh
agf --version    # Check installed version
agf validate     # Validate canonical sources and adapter mappings
agf list         # List available and installed agents
agf doctor       # Verify manifests, file permissions, and hashes
agf sync         # Idempotent sync across configured developer harnesses
```

## Stack

- **Core Engine:** Go (static binary compilation for Linux amd64/arm64, macOS, and Windows)
- **Bootstrap / Scripts:** Shell (`curl`, `tar`, `shasum`)
- **Specification:** Schema version 1 YAML frontmatter + Markdown contracts
