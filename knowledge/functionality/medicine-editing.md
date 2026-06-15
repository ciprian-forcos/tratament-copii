---
type: UI Functionality
title: Medicine Editing
description: Adds, edits, deletes, and validates medicines in the restored medicines path.
resource: src/components/MedicamenteTab.tsx
tags: [functionality, medicines]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Medicines page](../ui/medicines-page.md)

# Buttons And Controls

* [Medicines add button](../ui/buttons/medicines-add-button.md)
* [Medicines edit button](../ui/buttons/medicines-edit-button.md)
* [Medicines delete button](../ui/buttons/medicines-delete-button.md)
* [Medicines dialog save button](../ui/buttons/medicines-dialog-save-button.md)

# Source Functions

* `MedicamenteTab`
* `loadMedications`
* `saveMedications`
* `openAdd`
* `openEdit`
* `handleSave`
* `handleDelete`
* `getDuplicateError`
* `buildDoseConfig`

# Behavior

The restored medicines page lists default medicines when no custom medicine
state exists. The default list includes Nurofen, Panadol, and stronger
antipyretic entries such as Novocalmin/Diclofenac. Add/edit/delete uses the
legacy `MedicamenteTab` dialog and persists the full list to
`tratament-copii-medications`.

# Citations

* `src/components/MedicamenteTab.tsx`
* `src/components/design/medicineStorage.ts`
* `specs/medications.md`
* `specs/no-duplicate-medications.md`
