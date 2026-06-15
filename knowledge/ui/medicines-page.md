---
type: UI Page
title: Medicines Page
description: Planned restored medicine management page backed by the existing MedicamenteTab component.
resource: src/components/MedicamenteTab.tsx
tags: [ui, page, medicines, planned, phase-06-hardening]
timestamp: 2026-06-15T22:30:00+03:00
---

# User Job

Add, edit, and delete medicines, with antipyretics available by default.

# Current Status

`MedicamenteTab` exists but is not reachable from the current Design B route.
Phase 06 restores this path instead of building a new medicine editor.

# Feature And Functionality

* [Medicine management](../features/medicine-management.md)
* [Medicine editing](../functionality/medicine-editing.md)

# Buttons And Controls

* [Medicines add button](buttons/medicines-add-button.md)
* [Medicines edit button](buttons/medicines-edit-button.md)
* [Medicines delete button](buttons/medicines-delete-button.md)
* [Medicines delete confirm button](buttons/medicines-delete-confirm-button.md)
* [Medicines delete cancel button](buttons/medicines-delete-cancel-button.md)
* [Medicines add threshold button](buttons/medicines-add-threshold-button.md)
* [Medicines remove threshold button](buttons/medicines-remove-threshold-button.md)
* [Medicines color swatch button](buttons/medicines-color-swatch-button.md)
* [Medicines dialog cancel button](buttons/medicines-dialog-cancel-button.md)
* [Medicines dialog save button](buttons/medicines-dialog-save-button.md)

# Repeated Instances

Medicine cards render in a vertical list. Each card has one
[edit](buttons/medicines-edit-button.md) button and one
[delete](buttons/medicines-delete-button.md) button in its action area. Delete
confirmation appears inline under only the selected medicine card. In the dialog,
color swatches wrap across rows and threshold buttons repeat per threshold row.
The dialog body scrolls when the dynamic dose-form fields exceed the viewport.

# Source Functions

* `MedicamenteTab`
* `openAdd`
* `openEdit`
* `closeDialog`
* `handleSave`
* `handleDelete`
* `buildDoseConfig`
* `getDuplicateError`

# Citations

* `src/components/MedicamenteTab.tsx`
* `specs/medications.md`
* `specs/no-duplicate-medications.md`
* `.planning/phases/06-hardening/06-04-install-and-medicines-PLAN.md`
