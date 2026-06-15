---
type: UI Button
title: Medicines Remove Threshold Button
description: Removes a threshold row in the weight-threshold medicine form.
resource: src/components/MedicamenteTab.tsx
tags: [button, medicines, threshold, template]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Medicines page](../medicines-page.md)

# Functionality

* [Medicine editing](../../functionality/medicine-editing.md)

# Handler

Filters the selected row out of `form.thresholds`.

# Instances And Placement

One remove button appears per threshold row, except when there is only one row.
More threshold rows create more instances in the same form section.

# Citations

* `src/components/MedicamenteTab.tsx`
