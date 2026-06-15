---
type: Process Artifact
title: Delivery Loop Roles
description: Navigation map for the delivery loop role boundaries.
resource: .planning/PROCESS.md
tags: [process, loop, roles, review]
timestamp: 2026-06-15T21:45:00+03:00
---

# Role Map

The loop has five separate roles:

* [Orchestrator role](orchestrator-role.md) - owns sequencing, spawning, state, and escalation.
* [Implementer role](implementer-role.md) - changes code for one scoped plan.
* [Agent-Reviewer role](agent-reviewer-role.md) - verifies mechanics and evidence.
* [Design-Reviewer role](design-reviewer-role.md) - judges intent, UX, integration, and data safety.
* [Human Reviewer role](human-reviewer-role.md) - final authority for acceptance and release.

# Sequence

Orchestrator picks plan -> Implementer changes code -> Agent-Reviewer verifies
mechanics -> Design-Reviewer judges product fit -> Human Reviewer accepts final
result when needed.

# Current Simplification

Use the full role chain only when [Delivery loop evaluation](delivery-loop-evaluation.md)
says the risk justifies it. Most small work should use the shorter `Vx/phase-*`
branch, focused change, checks, and graph update path.

# Citations

* `.planning/PROCESS.md`
* `.planning/prompts/orchestrator.md`
* `.planning/prompts/implementer.md`
* `.planning/prompts/agent-reviewer.md`
* `.planning/prompts/design-reviewer.md`
