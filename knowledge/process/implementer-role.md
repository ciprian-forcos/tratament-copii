---
type: Process Artifact
title: Implementer Role
description: Worker role that executes one scoped plan and produces verifiable handoff evidence.
resource: .claude/agents/implementer.md
tags: [process, loop, role, implementer]
timestamp: 2026-06-15T21:45:00+03:00
---

# Job

The implementer changes code for one plan. It reads the plan, writes the
smallest working implementation, runs the gate, and reports evidence.

# Responsibilities

* Stay inside the plan scope or report deviations.
* Use visible TDD rhythm for new units: `[test]`, then `[feat]`, then optional `[refactor]`.
* Run the required checks and quote literal output in handoff.
* Preserve protected localStorage keys from [Local storage and app state](../implementation/app-state-local-storage.md).
* Fix every [Agent-Reviewer role](agent-reviewer-role.md) finding before asking for another cycle.

# Current Correction

Older prompt text says the implementer spawns the Agent-Reviewer. The verified
process note says subagents cannot spawn subagents; the [Orchestrator role](orchestrator-role.md)
must drive that loop.

# Does Not Do

* Decide whether the product is right for the [3 AM use case](../product/3am-use-case.md).
* Skip mechanical evidence.
* Delete legacy tabs unless a current phase explicitly chooses that scope.

# Citations

* `.claude/agents/implementer.md`
* `.planning/prompts/implementer.md`
* `.planning/PROCESS.md`
