---
type: Process Artifact
title: Design-Reviewer Role
description: Judgment reviewer that checks intent, specs, UX, integration, and data safety after mechanical signoff.
resource: .claude/agents/design-reviewer.md
tags: [process, loop, role, review, design, data-safety]
timestamp: 2026-06-15T21:45:00+03:00
---

# Job

The Design-Reviewer decides whether the right thing was built. It runs after
the [Agent-Reviewer role](agent-reviewer-role.md) has mechanically signed off.

# Checks

* Intent: the plan objective is actually met.
* Specs and brief: behavior matches [V1 scope](../product/v1-scope.md) and relevant specs.
* UX: the change holds up for the [3 AM use case](../product/3am-use-case.md).
* Integration: previous phase behavior still composes.
* Data safety: persisted state and share payloads are not put at risk.

# Does Not Do

* Re-run mechanical gate checks already covered by Agent-Reviewer.
* Edit files.
* Expand scope beyond the plan.
* Approve data-loss risk.

# Current Use

Use this role for work where judgment matters: medical timing, panic-flow UX,
share import/export, release readiness, or state migrations. Skip it for
obvious docs-only maintenance.

# Connected Concepts

* [Human Reviewer role](human-reviewer-role.md)
* [V1 scope](../product/v1-scope.md)
* [Treatment plan rules](../medical/treatment-plan-rules.md)
* [Share URL import and merge](../implementation/share-url-import-merge.md)

# Citations

* `.claude/agents/design-reviewer.md`
* `.planning/prompts/design-reviewer.md`
* `.planning/PROCESS.md`
