---
type: UI Button
title: Step 1 Temperature Preset Button
description: Repeated preset chip that sets Step 1 temperature to a fixed value.
resource: src/components/design/Step1.tsx
tags: [button, step1, temperature, template]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Step 1 temperature entry](../step1-temperature-entry.md)

# Functionality

* [Temperature entry](../../functionality/temperature-entry.md)

# Handler

Each preset button calls local `set(p)`.

# Template Note

One graph node represents all rendered preset chips.

# Instances And Placement

Preset chips render from `PRESETS` in a four-column grid below the main
temperature plus/minus controls. If the preset list grows, chips fill additional
rows inside the StepShell scroll area.

# Citations

* `src/components/design/Step1.tsx`
