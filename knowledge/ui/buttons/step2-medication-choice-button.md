---
type: UI Button
title: Step 2 Medication Choice Button
description: Repeated medication choice button for the previous-dose path.
resource: src/components/design/Step2.tsx
tags: [button, step2, medication, template]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Step 2 treatment history](../step2-treatment-history.md)

# Functionality

* [Treatment history entry](../../functionality/treatment-history-entry.md)

# Handler

Each medication button calls `set({ med: m.id })`.

# Instances And Placement

One instance renders for each item in Step 2's medication list, currently in a
two-column grid under the `medicament` label. Phase 06 should keep this as a
template but remove non-antipyretic instances such as Virodep.

# Known Bug

* [Step 2 Virodep choice](../../bugs/step2-virodep-choice.md)

# Citations

* `src/components/design/Step2.tsx`
