---
type: Process Artifact
title: Children BSA Display
description: QA bug node for removing unnecessary BSA display from the children menu.
resource: Bug reports/List
tags: [bug, v1, phase-06-hardening, children-screen, bsa]
timestamp: 2026-06-15T23:55:00+03:00
---

# Bug

BSA display in the children menu is not needed.

# Phase Mapping

* Phase: [V1 Phase 06 Hardening](../process/v1-phase-06-hardening.md)
* Suggested branch: `V1/phase-06-hardening/remove-bsa`
* Suggested plan: `.planning/phases/06-hardening/06-03-ui-cleanup-PLAN.md`

# Touchpoints

* [Children screen](../ui/children-screen.md)
* `src/components/design/ChildrenScreen.tsx`
* `src/components/design/ChildrenScreen.test.tsx`
* `src/utils/doseCalculation.ts`

# Done When

The children menu no longer shows BSA/estimated height. Dose calculation helpers can remain if still used elsewhere.

# Phase 06 Lane C State

Implemented in `src/components/design/ChildrenScreen.tsx`; BSA and estimated
height are absent from child cards.

# Citations

* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
* `src/components/design/ChildrenScreen.tsx`
