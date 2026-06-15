---
type: Implementation Module
title: Schedule Adapter And Treatment Plan
description: The active timing path maps dose history and schedule rules into the next treatment plan shown to the parent.
resource: src/components/design/dosePlan.ts
tags: [implementation, schedule, treatment-plan, medical-rules]
timestamp: 2026-06-15T23:35:00+03:00
---

# Responsibility

This path determines which antipyretic to give now, when the next one can be
given, and what amount appears in the [Plan card](../ui/plan-card.md).

# Current Files

* `src/data/scheduleRules.ts`
* `src/utils/scheduleEngine.ts`
* `src/components/design/scheduleAdapter.ts`
* `src/components/design/dosePlan.ts`

# Phase 06 Lane A State

Lane A aligns the panic-flow treatment planner with
[Treatment plan rules](../medical/treatment-plan-rules.md):

* Nurofen recurring rule: 8 hours.
* Panadol recurring rule: 8 hours.
* Cross-drug floor in `dosePlan.ts`: 4 hours.
* Step 2 passes an absolute previous-dose datetime through `lastAt`.

Home fallback countdown behavior is covered separately by Phase 06 Lane B.

# Design Boundary

The module must keep [Dosage versus treatment plan](../medical/dosage-vs-treatment-plan.md) separate:

* dose amount comes from `calculateDose`.
* treatment timing comes from schedule rules plus administered history.

# Citations

* `src/data/scheduleRules.ts`
* `src/utils/scheduleEngine.ts`
* `src/components/design/scheduleAdapter.ts`
* `src/components/design/dosePlan.ts`
* `src/components/design/dosePlan.test.ts`
* `src/components/design/scheduleAdapter.test.ts`
