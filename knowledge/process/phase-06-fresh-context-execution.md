---
type: Process Artifact
title: Phase 06 Fresh Context Execution
description: How to run Phase 06 implementation with fresh-context subagents per plan and review cycle.
resource: .planning/phases/06-hardening/
tags: [process, phase, v1, hardening, subagents, fresh-context]
timestamp: 2026-06-15T22:45:00+03:00
---

# Decision

Phase 06 has enough product, bug, page, button, functionality, and role nodes to
start implementation. The missing piece was this execution map: how to hand each
grouped plan to fresh-context agents without relying on chat history.

# Fresh Context Rule

Each agent cycle starts cold. Do not rely on inherited conversation context.
The orchestrator must pass the role, plan path, branch, graph nodes, and expected
checks in the prompt. Do not reuse the same reviewer for consecutive cycles.

# Orchestrator

The main thread acts as [Orchestrator role](orchestrator-role.md):

1. Pick the next plan from [V1 Phase 06 Hardening](v1-phase-06-hardening.md).
2. Spawn one fresh [Implementer role](implementer-role.md) for that plan.
3. After implementation, spawn a fresh [Agent-Reviewer role](agent-reviewer-role.md).
4. Spawn [Design-Reviewer role](design-reviewer-role.md) when the plan touches
   medical timing, panic-flow UX, PWA install, medicines, share/import, or
   persisted state.
5. Update plan summary and knowledge graph only after the implementation is
   verified.

Use [Phase 06 parallel execution map](phase-06-parallel-execution-map.md) to
decide which implementers can run at the same time and which write scopes must
stay serial.

# Implementer Prompt Inputs

Every implementer gets these paths:

* the exact plan file under `.planning/phases/06-hardening/`,
* `.planning/PROCESS.md`,
* `.planning/TEST_CONVENTIONS.md`,
* [V1 Phase 06 Hardening](v1-phase-06-hardening.md),
* [UI interaction graph](../ui/interaction-graph.md),
* affected bug nodes,
* affected page/button/functionality nodes,
* affected source files and tests named by the plan.

The implementer must:

* use the `V1/phase-06-hardening` branch convention,
* preserve visible TDD history: `[test]` before `[feat]`,
* update the UI graph nodes touched by behavior changes,
* run the plan verification commands,
* report changed files and exact check results.

# Reviewer Prompt Inputs

Every Agent-Reviewer gets:

* the plan file,
* [Agent-Reviewer role](agent-reviewer-role.md),
* `git diff` / changed files,
* `git log main..HEAD --oneline`,
* check output from the implementer.

It verifies scope, checks, TDD rhythm, and graph updates. It returns
`SIGNOFF` or concrete `FINDINGS`.

# Phase 06 Plan Map

* `06-01-treatment-history-and-timing-PLAN.md` - use Implementer,
  Agent-Reviewer, and Design-Reviewer. This touches medical timing and
  treatment-history UX.
* `06-02-home-screen-hardening-PLAN.md` - use Implementer, Agent-Reviewer, and
  Design-Reviewer. This touches panic-flow UX.
* `06-03-ui-cleanup-PLAN.md` - use Implementer and Agent-Reviewer. Add
  Design-Reviewer only if the visual result is ambiguous.
* `06-04-install-and-medicines-PLAN.md` - use Implementer, Agent-Reviewer, and
  Design-Reviewer. This touches PWA install, medicine state, and restored
  navigation.

# Parallelism

Do not split `06-01`; it owns the Step2/PlanCard/dosePlan contract. After
`06-01` is green, `06-02` and `06-03` can run as parallel lanes if their write
sets stay disjoint. Run `06-04` last.

# Citations

* `knowledge/process/phase-06-parallel-execution-map.md`
* `.planning/phases/06-hardening/06-00-OVERVIEW.md`
* `.planning/phases/06-hardening/06-01-treatment-history-and-timing-PLAN.md`
* `.planning/phases/06-hardening/06-02-home-screen-hardening-PLAN.md`
* `.planning/phases/06-hardening/06-03-ui-cleanup-PLAN.md`
* `.planning/phases/06-hardening/06-04-install-and-medicines-PLAN.md`
* `.planning/PROCESS.md`
