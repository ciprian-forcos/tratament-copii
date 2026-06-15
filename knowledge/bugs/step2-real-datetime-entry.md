---
type: Process Artifact
title: Step 2 Real Date/Time Entry
description: QA bug node for replacing fixed hour chips with real date/time entry.
resource: Bug reports/List
tags: [bug, v1, phase-06-hardening, step2, datetime]
timestamp: 2026-06-15T22:00:00+03:00
---

# Bug

Step 2 needs real date/time entry because treatment may have started days ago.

# Phase Mapping

* Phase: [V1 Phase 06 Hardening](../process/v1-phase-06-hardening.md)
* Suggested branch: `V1/phase-06-hardening/step2-datetime`
* Suggested plan: `.planning/phases/06-hardening/06-01-treatment-history-and-timing-PLAN.md`

# Touchpoints

* [Step 2 treatment history](../ui/step2-treatment-history.md)
* `src/components/design/Step2.tsx`
* `src/components/design/dosePlan.ts`
* `src/components/design/PlanCard.tsx`

# Done When

The parent can enter a real previous administration date and time, and treatment planning uses that datetime rather than a same-day `HH:MM` guess.

# Citations

* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
* `src/components/design/Step2.tsx`
* `src/components/design/dosePlan.ts`
