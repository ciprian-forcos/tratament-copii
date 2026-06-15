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
* Feature
* UI Page
* Medical Rule
* Terminology
* UI Element
* UI Button
* UI Control
* UI Functionality
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

# UI Graph Rules

Treat the interface as a traceable graph:

* General spec/product node -> feature node -> page/sheet node -> functionality
  node -> button/control node -> source function/store/test/bug links.
* Every routable page, sheet, modal, or import overlay gets a `UI Page` node.
* Every distinct button role gets a `UI Button` node linked back to its page.
  Repeated row buttons use one template node, not one node per rendered row.
* Non-button interactive inputs such as checkboxes and clickable wheel values
  get `UI Control` nodes when they drive important behavior.
* Page nodes should list upstream features, downstream functionality,
  buttons/controls, source components, relevant tests, and known bugs.
* Button/control nodes should name their handler or source function when the
  code has one.
* Repeated button/control template nodes must explain where each instance
  appears, what creates more instances, and how the page should behave when
  there are many.

# Citation Rule

Use `# Citations` for repo files, planning docs, external links, or conversation
events that support the note. Do not invent external medical or product facts.
