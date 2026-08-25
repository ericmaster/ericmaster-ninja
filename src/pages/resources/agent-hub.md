---
layout: ../../layouts/PageLayout.astro
title: "Agent Hub"
slug: "agent-hub"
description: "Public catalog and distribution hub for portable custom agents extending Agent Fabric."
tags: ["ai-agents", "agent-fabric", "developer-tools", "catalog"]
category: "Resources"
---

# Agent Hub

**GitHub:** [https://github.com/ericmaster/agent-hub](https://github.com/ericmaster/agent-hub)

Agent Hub is the public catalog and distribution repository for portable custom agents that extend Agent Fabric. It provides specialized agents designed for advanced planning, autonomous workflows, and targeted developer tasks.

## Quick Install

Install agents from the public catalog using the Agent Fabric CLI (`agf`):

```sh
agf hub install https://github.com/ericmaster/agent-hub \
  --tools opencode,kilo --yes
```

Or from a local checkout:

```sh
git clone https://github.com/ericmaster/agent-hub
agf hub install ./agent-hub --yes
```

## Catalog Agents

- **`mr-meeseeks`**: Single-purpose task execution agent designed for rapid problem solving and immediate fulfillment.
- **`simplification-planner`**: Specialized planner that audits proposed changes, decomposes complex plans, and enforces minimalism and simplicity before execution (requires core `planner`).

## Architecture & Contract

- **Canonical Markdown Contract:** Agents use schema version 1 frontmatter, declarative lifecycle hooks, and portable capability policies.
- **Dependency Graph Validation:** Hub verifies inter-agent dependencies prior to installation to prevent broken states and name collisions.
- **Provider Agnostic:** Private task systems, credentials, and provider configurations remain host-owned and decouple from catalog definitions.

## Stack

- **Contract:** Agent Fabric schema version 1 Markdown definitions
- **Distribution:** Git repository, HTTPS tarballs, and release archives
