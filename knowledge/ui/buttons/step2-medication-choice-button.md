---
type: UI Button
title: Step 2 Medication Choice Button
description: Repeated medication choice button for the previous-dose path.
resource: src/components/design/Step2.tsx
tags: [button, step2, medication, template]
timestamp: 2026-06-15T23:35:00+03:00
---

# Page

* [Step 2 treatment history](../step2-treatment-history.md)

# Functionality

* [Treatment history entry](../../functionality/treatment-history-entry.md)

# Handler

Each medication button calls `set({ med: m.id })`.

# Instances And Placement

One instance renders for each item in Step 2's medication list, currently in a
two-column grid under the `medicament` label. The implemented previous-dose
list renders Nurofen and Panadol only.

# Phase 06 State

[Step 2 Virodep choice](../../bugs/step2-virodep-choice.md) is resolved for
the previous-dose path; Virodep is not rendered there.

# Citations

* `src/components/design/Step2.tsx`
