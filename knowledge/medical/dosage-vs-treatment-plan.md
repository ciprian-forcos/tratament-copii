---
type: Terminology
title: Dosage Versus Treatment Plan
description: Dosage is the mg/kg amount; treatment plan is the which-medicine-and-when decision.
resource: .planning/phases/06-hardening/06-00-OVERVIEW.md
tags: [terminology, dosage, treatment-plan, safety]
timestamp: 2026-06-15T19:00:00+03:00
---

# Definition

Dosage means the medicine amount, derived from the child weight and the
medicine concentration. In code this belongs near `doseCalculation.ts`.

Treatment plan means which antipyretic should be administered and when the next
one is eligible. In code this belongs near `scheduleRules.ts`,
`scheduleAdapter.ts`, and `dosePlan.ts`.

# Why This Boundary Matters

The app can calculate a correct amount and still produce a wrong treatment
sequence. The [Treatment plan rules](treatment-plan-rules.md) must therefore be
tracked separately from dosage math.

# Implementation Boundary

* Dosage: `src/utils/doseCalculation.ts`
* Treatment plan: [Schedule adapter and treatment plan](../implementation/schedule-adapter-and-dose-plan.md)
* User-facing result: [Plan card](../ui/plan-card.md)

# Citations

* `.planning/phases/06-hardening/06-00-OVERVIEW.md` from `origin/harness/autonomous-v1-delivery`
* `src/utils/doseCalculation.ts`
* `src/components/design/dosePlan.ts`
