---
type: Process Artifact
title: Step 2 Virodep Choice
description: QA bug node for removing Virodep from last-dose antipyretic choices.
resource: Bug reports/List
tags: [bug, v1, phase-06-hardening, step2, medical-rules]
timestamp: 2026-06-15T23:35:00+03:00
---

# Bug

Virodep is not antipyretic and should not appear in last-dose choices.

# Phase Mapping

* Phase: [V1 Phase 06 Hardening](../process/v1-phase-06-hardening.md)
* Suggested branch: `V1/phase-06-hardening/remove-virodep`
* Suggested plan: `.planning/phases/06-hardening/06-01-treatment-history-and-timing-PLAN.md`

# Touchpoints

* [Step 2 treatment history](../ui/step2-treatment-history.md)
* [Treatment plan rules](../medical/treatment-plan-rules.md)
* `src/components/design/Step2.tsx`

# Done When

Step 2 offers only antipyretic last-dose choices relevant to fever treatment.

# Phase 06 Lane A State

Implemented in the previous-dose path; Step 2 renders Nurofen and Panadol only.

# Citations

* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
* [Treatment plan rules](../medical/treatment-plan-rules.md)
* `src/components/design/Step2.tsx`
