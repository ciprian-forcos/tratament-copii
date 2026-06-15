---
type: Implementation Module
title: Schedule Adapter And Treatment Plan
description: The active timing path maps dose history and schedule rules into the next treatment plan shown to the parent.
resource: src/components/design/dosePlan.ts
tags: [implementation, schedule, treatment-plan, medical-rules]
timestamp: 2026-06-15T19:00:00+03:00
---

# Responsibility

This path determines which antipyretic to give now, when the next one can be
given, and what amount appears in the [Plan card](../ui/plan-card.md).

# Current Files

* `src/data/scheduleRules.ts`
* `src/utils/scheduleEngine.ts`
* `src/components/design/scheduleAdapter.ts`
* `src/components/design/dosePlan.ts`

# Current Mismatches

Against [Treatment plan rules](../medical/treatment-plan-rules.md), latest
`main` still has:

* Panadol recurring rule: 6 hours.
* Cross-drug floor in `dosePlan.ts`: 2 hours.
* Home fallback countdown: 2 hours.

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
