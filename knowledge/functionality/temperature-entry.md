---
type: UI Functionality
title: Temperature Entry
description: Captures and persists the active child's current temperature.
resource: src/components/design/Step1.tsx
tags: [functionality, temperature, child-state]
timestamp: 2026-06-15T23:58:00+03:00
---

# Pages

* [Home screen](../ui/home-screen.md)
* [Step 1 temperature entry](../ui/step1-temperature-entry.md)
* [Temperature picker sheet](../ui/temperature-picker-sheet.md)

# Buttons And Controls

* [Home temperature button](../ui/buttons/home-temperature-button.md)
* [Step 1 temperature minus button](../ui/buttons/step1-temperature-minus-button.md)
* [Step 1 temperature plus button](../ui/buttons/step1-temperature-plus-button.md)
* [Step 1 temperature preset button](../ui/buttons/step1-temperature-preset-button.md)
* [Temperature wheel save button](../ui/buttons/temp-wheel-save-button.md)

# Source Functions

* `Step1`
* `PersistTempOnChange`
* `TempWheel`
* `childStore.patchActive`

# Current Behavior

Home exposes a distinct `Temperatura` control that opens `TempWheel`; Step 1
keeps the panic-flow temperature entry.

# Citations

* `src/components/design/Step1.tsx`
* `src/components/design/TempWheel.tsx`
