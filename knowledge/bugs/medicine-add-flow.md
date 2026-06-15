---
type: Process Artifact
title: Medicine Add Flow
description: QA bug node for the lack of a way to add medicines.
resource: Bug reports/List
tags: [bug, v1, phase-06-hardening, medicines, scope]
timestamp: 2026-06-15T22:00:00+03:00
---

# Bug

QA says there is no possibility to add medicines.

# Phase Mapping

* Phase: [V1 Phase 06 Hardening](../process/v1-phase-06-hardening.md)
* Suggested branch: `V1/phase-06-hardening/medicine-add-decision`
* Suggested plan: `.planning/phases/06-hardening/06-04-install-and-medicines-PLAN.md`

# Scope Conflict

[V1 scope](../product/v1-scope.md) generally excludes broad medicine-program
management. Phase 06 records an exception: restore the existing `MedicamenteTab`
path so parents can add/edit medicines without creating a second editor.

# Touchpoints

* [Children screen](../ui/children-screen.md)
* [Application source map](../sources/app-source-map.md)
* `src/components/MedicamenteTab.tsx`
* `src/components/design/ChildrenScreen.tsx`

# Done When

Either a minimal V1 medicine-add path exists, or the phase records a deliberate deferral with copy that avoids making the app feel broken.

# Phase 06 Lane D State

Implemented by routing Children -> `Medicamente` -> `MedicamenteTab`. The editor
uses the existing add/edit/delete flow and persists through
`tratament-copii-medications`; default antipyretics are present when the key is
absent.

# Citations

* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
* [V1 scope](../product/v1-scope.md)
* `src/components/MedicamenteTab.tsx`
* `src/components/design/FlowProtoB.tsx`
* `src/components/design/medicineStorage.ts`
