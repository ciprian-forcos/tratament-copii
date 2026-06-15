---
type: Process Artifact
title: Agent-Reviewer Role
description: Mechanical reviewer that verifies branch state, gate output, scope, blocker resolution, and TDD rhythm.
resource: .claude/agents/agent-reviewer.md
tags: [process, loop, role, review, verification]
timestamp: 2026-06-15T21:45:00+03:00
---

# Job

The Agent-Reviewer checks facts, not taste. It returns exactly `SIGNOFF` or
`FINDINGS`.

# Responsibilities

* Verify local and remote branch SHAs match.
* Run or check `scripts/verify-plan.sh`.
* Compare literal gate output against the implementer's report.
* Confirm blocker resolutions with file, line, or command evidence.
* Check scope against the plan's declared files.
* Check TDD rhythm when new units were created.

# Does Not Do

* Judge UX, architecture, or product fit.
* Edit files.
* Trust summaries without evidence.
* Soften a failed check into a note.

# Current Use

Use this role only when the heavier harness is worth its cost. For a small local
wiki or copy edit, [Delivery loop evaluation](delivery-loop-evaluation.md)
recommends direct implementation plus checks.

# Connected Concepts

* [Implementer role](implementer-role.md)
* [Design-Reviewer role](design-reviewer-role.md)
* [Tooling and deploy source map](../sources/tooling-and-deploy.md)

# Citations

* `.claude/agents/agent-reviewer.md`
* `.planning/prompts/agent-reviewer.md`
* `scripts/verify-plan.sh`
* `.planning/PROCESS.md`
