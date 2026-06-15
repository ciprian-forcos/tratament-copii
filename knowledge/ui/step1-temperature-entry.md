---
type: UI Page
title: Step 1 Temperature Entry
description: Panic-flow step where the parent enters the active child's current temperature.
resource: src/components/design/Step1.tsx
tags: [ui, page, panic-flow, temperature]
timestamp: 2026-06-15T22:30:00+03:00
---

# User Job

The parent adjusts or presets the active child's current temperature before
continuing to treatment history.

# Feature And Functionality

* [Panic treatment flow](../features/panic-treatment-flow.md)
* [Temperature entry](../functionality/temperature-entry.md)
* [Child profile management](../features/child-profile-management.md)

# Buttons

* [Step shell back button](buttons/step-shell-back-button.md)
* [Step 1 temperature minus button](buttons/step1-temperature-minus-button.md)
* [Step 1 temperature plus button](buttons/step1-temperature-plus-button.md)
* [Step 1 temperature preset button](buttons/step1-temperature-preset-button.md)
* [Step shell primary CTA button](buttons/step-shell-primary-cta-button.md)

# Repeated Instances

Temperature preset buttons are rendered from the preset array in a four-column
grid below the plus/minus controls. More presets would continue filling the
grid row by row inside the StepShell scroll area.

# Source Functions

* `Step1`
* `PersistTempOnChange`
* `StepShell`
* `childStore.patchActive`

# Citations

* `src/components/design/Step1.tsx`
* `src/components/design/StepShell.tsx`
