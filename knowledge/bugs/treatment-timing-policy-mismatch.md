---
type: Process Artifact
title: Treatment Timing Policy Mismatch
description: QA bug node for Nurofen/Panadol spacing mismatches against current project timing rules.
resource: Bug reports/List
tags: [bug, v1, phase-06-hardening, medical-rules, schedule]
timestamp: 2026-06-15T22:00:00+03:00
---

# Bug

Treatment timing must follow [Treatment plan rules](../medical/treatment-plan-rules.md).

# Phase Mapping

* Phase: [V1 Phase 06 Hardening](../process/v1-phase-06-hardening.md)
* Suggested branch: `V1/phase-06-hardening/timing-policy`
* Suggested plan: `.planning/phases/06-hardening/06-01-treatment-history-and-timing-PLAN.md`

# Current Mismatches

* `src/data/scheduleRules.ts` still has Panadol at `6h`.
* `src/components/design/dosePlan.ts` still uses a `2h` cross-drug floor.
* `src/components/design/HomeB.tsx` still has a `2h` fallback countdown.

# Touchpoints

* [Schedule adapter and treatment plan](../implementation/schedule-adapter-and-dose-plan.md)
* [Dosage versus treatment plan](../medical/dosage-vs-treatment-plan.md)
* `src/data/scheduleRules.ts`
* `src/components/design/dosePlan.ts`
* `src/components/design/scheduleAdapter.test.ts`
* `src/components/design/dosePlan.test.ts`

# Done When

Code, tests, UI fallback behavior, and medicine notes all match the current project timing policy.

# Citations

* [Treatment plan rules](../medical/treatment-plan-rules.md)
* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
* `src/data/scheduleRules.ts`
* `src/components/design/dosePlan.ts`
