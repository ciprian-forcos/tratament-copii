---
type: Process Artifact
title: Repository Source Inventory
description: Repo-wide ingest map for first-party source material and explicit exclusions.
resource: .
tags: [sources, ingest, inventory, repo, wiki]
timestamp: 2026-06-15T21:30:00+03:00
---

# Ingest Scope

The repo-wide ingest covers first-party project sources:

* `.planning/` - 26 Markdown planning, process, prompt, phase, and handoff files.
* `specs/` - 5 product/domain specification files.
* `src/` - active React/Vite source, legacy tab source, stores, utilities, and 14 co-located Vitest tests.
* Root tooling - `package.json`, TypeScript configs, Vite/Vitest/ESLint config, PWA files, and icons.
* Delivery tooling - `.github/workflows/deploy.yml`, `scripts/verify-plan.sh`, and `.claude/agents/*.md`.

# Explicit Exclusions

These are not treated as semantic source for the knowledge graph:

* `.git/`
* `node_modules/`
* `dist/`
* `knowledge/` itself
* `.codex/` except for the generated wiki registry
* `assets/index-*.js` and `assets/index-*.css`, because they are generated build artifacts

# Truth Layers

Use these layers when sources disagree:

1. Current implementation truth: `src/`, root config, and current branch state.
2. Current knowledge graph decisions: this vault, especially [Treatment plan rules](../medical/treatment-plan-rules.md) and [Version and phase branch naming](../process/version-phase-branch-naming.md).
3. Historical planning evidence: [.planning corpus](planning-corpus.md).
4. Broader original specs: [Specs corpus](specs-corpus.md), which may describe capabilities outside current V1.

# Connected Source Nodes

* [Planning corpus](planning-corpus.md)
* [Specs corpus](specs-corpus.md)
* [Application source map](app-source-map.md)
* [Tooling and deploy source map](tooling-and-deploy.md)
* [Delivery loop evaluation](../process/delivery-loop-evaluation.md)

# Citations

* `rg --files -g '!node_modules' -g '!dist' -g '!.git' -g '!knowledge' -g '!.codex'`
* `.codex/wiki-registry.json`
* `knowledge/AGENTS.md`
