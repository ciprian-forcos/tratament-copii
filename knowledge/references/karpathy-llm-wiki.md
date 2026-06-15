---
type: External Reference
title: Karpathy LLM Wiki Pattern
description: LLM Wiki compiles raw sources into a persistent, interlinked markdown knowledge base maintained by an agent.
resource: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
tags: [llm-wiki, knowledge, markdown, agents]
timestamp: 2026-06-15T19:00:00+03:00
---

# Pattern

The pattern has three layers:

* raw sources: immutable inputs,
* wiki: agent-maintained markdown pages,
* schema: instructions that define structure and maintenance workflows.

# Operations

* Ingest: read new source material and update the wiki.
* Query: answer from the wiki first, with citations.
* Lint: find contradictions, stale claims, missing links, and orphan pages.

# How It Applies Here

The source code, planning docs, QA bug reports, and medical references are raw
sources. This `knowledge/` directory is the compiled wiki. Future repo work
should update the relevant concept nodes when behavior changes.

# Citations

* https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
* [Open Knowledge Format](open-knowledge-format.md)
