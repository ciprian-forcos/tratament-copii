---
type: Process Artifact
title: Human Reviewer Role
description: Final authority for acceptance, product judgment, release decisions, and unresolved tradeoffs.
resource: .planning/PROCESS.md
tags: [process, loop, role, human-review]
timestamp: 2026-06-15T21:45:00+03:00
---

# Job

The human reviewer is the final authority. In the old heavy harness, the human
sees work after mechanical and design review. In the lighter current loop, the
human decides when a tradeoff is big enough to stop and discuss.

# Responsibilities

* Accept or reject release readiness.
* Decide unresolved medical, UX, scope, or data-safety tradeoffs.
* Merge to `main` when a version is ready.
* QA the real app, especially the [3 AM use case](../product/3am-use-case.md).

# Does Not Need To Do

* Re-check every mechanical gate when the heavy loop already produced verified evidence.
* Review every tiny docs or wiki maintenance change.

# Escalation Triggers

Escalate here when:

* a data-safety risk appears,
* medical timing assumptions conflict,
* a plan returns repeated design `CHANGES`,
* source truth is unclear,
* release or merge timing is a product decision.

# Connected Concepts

* [Orchestrator role](orchestrator-role.md)
* [Delivery loop evaluation](delivery-loop-evaluation.md)
* [Current repository branch state](repo-branch-state.md)

# Citations

* `.planning/PROCESS.md`
* `.planning/V1_ACCEPTANCE.md`
* `.planning/QA_HANDOFF.md`
