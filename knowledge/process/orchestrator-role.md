---
type: Process Artifact
title: Orchestrator Role
description: Owner of the delivery loop, role spawning, state tracking, and escalation.
resource: .planning/PROCESS.md
tags: [process, loop, role, orchestrator]
timestamp: 2026-06-15T21:45:00+03:00
---

# Job

The orchestrator owns the run. It picks the next plan, assigns work, routes
review findings, records state, and stops when a human decision is needed.

# Current Truth

The later verified Cowork facts in `.planning/PROCESS.md` override the older
prompt wording: the orchestrator drives every spawn. Implementers do not spawn
reviewers themselves.

# Responsibilities

* Read delivery state, roadmap, acceptance criteria, and the active plan.
* Spawn fresh [Implementer role](implementer-role.md), [Agent-Reviewer role](agent-reviewer-role.md), and [Design-Reviewer role](design-reviewer-role.md) instances when using the heavy harness.
* Keep branch, clone, SHA, plan status, and blocker state current.
* Ensure Tier 1 `SIGNOFF` and Tier 2 `APPROVE` refer to the same tip SHA.
* Escalate to the [Human Reviewer role](human-reviewer-role.md) on stop conditions.

# Does Not Do

* Write feature code in the heavy harness.
* Auto-merge to `main`.
* Let stale `.planning/PROCESS.md` branch naming override [Version and phase branch naming](version-phase-branch-naming.md).

# When To Use

Use this role for risky multi-step work: medical timing, persisted data, share
format, release/deploy, or broad refactors. For simple fixes, use the lighter
loop in [Delivery loop evaluation](delivery-loop-evaluation.md).

# Connected Concepts

* [Autonomous harness](autonomous-harness.md)
* [Delivery loop evaluation](delivery-loop-evaluation.md)
* [Planning corpus](../sources/planning-corpus.md)

# Citations

* `.planning/PROCESS.md`
* `.planning/prompts/orchestrator.md`
* `.planning/DELIVERY_STATE.md`
