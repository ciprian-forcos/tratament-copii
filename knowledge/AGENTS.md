---
type: Wiki Schema
title: Tratament Febra Copii Knowledge Schema
description: Local writing rules for the project OKF and Obsidian knowledge graph.
resource: knowledge/
tags: [schema, okf, llm-wiki, knowledge]
timestamp: 2026-06-15T21:00:00+03:00
---

# Tratament Febra Copii Knowledge Schema

This vault is the project's compiled knowledge graph. It follows the Open
Knowledge Format shape used by [Open Knowledge Format](references/open-knowledge-format.md):

* one concept per Markdown file,
* YAML frontmatter on every concept file,
* relative Markdown links as graph edges,
* `index.md` for navigation,
* `log.md` for dated maintenance notes.

# Page Types

Use the existing type vocabulary unless a new page clearly needs a new type:

* Product Concept
* Medical Rule
* Terminology
* UI Element
* Implementation Module
* Process Artifact
* External Reference
* Wiki Schema

# Writing Rules

* Preserve the difference between project assumptions, source facts, and
  contributor inference.
* Medical behavior must link back to [Treatment plan rules](medical/treatment-plan-rules.md)
  and source caveats when relevant.
* Process decisions should link to [Current repository branch state](process/repo-branch-state.md)
  or [Autonomous harness](process/autonomous-harness.md) when they affect delivery flow.
* Prefer updating an existing concept over adding a disconnected note.
* When behavior changes, update both the implementation/UI node and `log.md`.

# Citation Rule

Use `# Citations` for repo files, planning docs, external links, or conversation
events that support the note. Do not invent external medical or product facts.
