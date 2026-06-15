---
type: Process Artifact
title: Autonomous Harness
description: The project used a phased implementation loop with implementer, reviewer, and delivery-state gates.
resource: .planning/PROCESS.md
tags: [process, harness, delivery, review]
timestamp: 2026-06-15T19:00:00+03:00
---

# Purpose

The harness turned V1 delivery into small plan units with implementation,
review, tests, build gates, and handoff notes.

# Current Role

For future hardening, the useful part is the discipline:

* keep changes small and tied to a plan,
* run checks,
* record status,
* keep product, medical, UI, implementation, and process knowledge updated.

The harness branch itself is not the implementation source of truth; see
[Current repository branch state](repo-branch-state.md).

# Connected Methods

* [Open Knowledge Format](../references/open-knowledge-format.md)
* [Karpathy LLM Wiki pattern](../references/karpathy-llm-wiki.md)
* [Ponytail simplification discipline](../references/ponytail.md)
* [Version and phase branch naming](version-phase-branch-naming.md)
* [Ponytail audit observations](ponytail-audit-observations.md)

# Citations

* `.planning/PROCESS.md`
* `.planning/DELIVERY_STATE.md`
* `.planning/QA_HANDOFF.md`
