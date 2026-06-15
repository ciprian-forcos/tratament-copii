---
type: Process Artifact
title: Phase 06 Parallel Execution Map
description: Parallelization rules and lane ownership for V1 Phase 06 hardening implementation.
resource: .planning/phases/06-hardening/
tags: [process, phase, v1, hardening, parallel, subagents]
timestamp: 2026-06-15T23:00:00+03:00
---

# Decision

Phase 06 should use parallel subagents where ownership is disjoint. Do not split
tightly coupled contracts across workers just to use more agents.

# Dependency Shape

`06-01` is the contract gate. It changes `Step2Value`, Step 2 input semantics,
`PlanCard`, `buildPlan`, and timing rules. Other lanes should not edit that
contract until `06-01` is green.

After `06-01`, `06-02` and `06-03` can run in parallel. `06-04` should run last
because it overlaps navigation and page surfaces touched by the other lanes.

# Lanes

## Lane A: 06-01 Treatment History And Timing

Run serially first.

Owned files:

* `src/components/design/Step2.tsx`
* `src/components/design/Step2.test.tsx`
* `src/components/design/FlowProtoB.tsx`
* `src/components/design/PlanCard.tsx`
* `src/components/design/dosePlan.ts`
* `src/components/design/dosePlan.test.ts`
* `src/components/design/scheduleAdapter.test.ts`
* `src/data/scheduleRules.ts`
* `src/data/medications.ts`
* matching Step 2, treatment-history, dose-plan, and timing graph nodes.

Reason not to split: all tasks share the same datetime/timing API.

## Lane B: 06-02 Home Screen Hardening

Can run after Lane A starts only if it avoids `PlanCard`, `Step2`, and
`dosePlan`. Best run after Lane A is green.

Owned files:

* `src/components/design/HomeB.tsx`
* `src/components/design/HomeB.test.tsx`
* `src/components/design/ChildPill.tsx`
* `src/components/design/ChildPill.test.tsx`
* `src/components/design/StatusBar.tsx`
* `src/components/design/StatusBar.test.tsx`
* `src/components/design/useNightTimeline.ts`
* matching home, child-pill, status, timeline, and temperature graph nodes.

## Lane C: 06-03 UI Cleanup

Can run in parallel with Lane B after Lane A is green.

Owned files:

* `src/components/design/ChildrenScreen.tsx`
* `src/components/design/ChildrenScreen.test.tsx`
* `src/components/design/PlanCard.tsx`
* `src/components/design/PlanCard.test.tsx`
* matching children-screen and plan-card graph nodes.

Conflict note: if Lane A still owns `PlanCard`, do not start the PlanCard part
of Lane C. The BSA removal can still be done independently.

## Lane D: 06-04 Install And Medicines

Run last.

Owned files:

* `src/components/design/FlowProtoB.tsx`
* `src/components/design/HomeB.tsx`
* `src/components/design/HomeB.test.tsx`
* `src/components/design/ChildrenScreen.tsx`
* `src/components/design/ChildrenScreen.test.tsx`
* `src/components/MedicamenteTab.tsx`
* medicine storage/share/import touchpoints named by the plan.
* matching install, medicines, children, home, and navigation graph nodes.

Reason to run last: it overlaps routing, Home, Children, PWA install, medicine
state, and restored legacy UI.

# Orchestration

1. Finish Lane A.
2. Spawn Lane B and Lane C workers in parallel with disjoint write scopes.
3. Review and integrate B/C separately.
4. Spawn Lane D.
5. Run full gate and manual QA deploy/push flow.

# Reviewer Parallelism

Use a fresh [Agent-Reviewer role](agent-reviewer-role.md) per lane. Lane B and
Lane C reviewers may run in parallel after their worker branches are ready.
Use [Design-Reviewer role](design-reviewer-role.md) for Lane A, Lane B, and
Lane D; use it for Lane C only if visual or safety copy judgment is ambiguous.

# Citations

* [V1 Phase 06 Hardening](v1-phase-06-hardening.md)
* [Phase 06 fresh context execution](phase-06-fresh-context-execution.md)
* `.planning/phases/06-hardening/06-01-treatment-history-and-timing-PLAN.md`
* `.planning/phases/06-hardening/06-02-home-screen-hardening-PLAN.md`
* `.planning/phases/06-hardening/06-03-ui-cleanup-PLAN.md`
* `.planning/phases/06-hardening/06-04-install-and-medicines-PLAN.md`
