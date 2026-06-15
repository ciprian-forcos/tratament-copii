---
type: Feature
title: Medicine Management
description: Medicine add, edit, delete, and dose configuration through the restored medicines path.
resource: src/components/MedicamenteTab.tsx
tags: [feature, medicines, phase-06-hardening]
timestamp: 2026-06-15T22:30:00+03:00
---

# Purpose

Restores the existing medicine editor instead of building a second one. Phase 06
decides that antipyretics must be available in this path.

# Phase 06 Lane D State

Implemented through the existing `MedicamenteTab` only. The active route lives
in `FlowProtoB`, and medicine state is loaded/saved through the shared
`tratament-copii-medications` key. No second custom medicine editor was added.

# Source Spec

* [Specs corpus](../sources/specs-corpus.md)
* [V1 Phase 06 Hardening](../process/v1-phase-06-hardening.md)

# Page

* [Medicines page](../ui/medicines-page.md)

# Functionality

* [Medicine editing](../functionality/medicine-editing.md)

# Source Functions

* `MedicamenteTab`
* `loadMedications`
* `saveMedications`
* `notifyMedicationsChanged`
* `openAdd`
* `openEdit`
* `handleSave`
* `handleDelete`
* `buildDoseConfig`
* `getDuplicateError`

# Citations

* `specs/medications.md`
* `specs/no-duplicate-medications.md`
* [Medicine add flow](../bugs/medicine-add-flow.md)
* `.planning/phases/06-hardening/06-04-install-and-medicines-PLAN.md`
* `src/components/design/FlowProtoB.tsx`
* `src/components/design/medicineStorage.ts`
