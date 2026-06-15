---
type: UI Control
title: Temperature Wheel Value Control
description: Clickable wheel item that scrolls/selects integer or decimal temperature values.
resource: src/components/design/TempWheel.tsx
tags: [control, temperature, wheel, template]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Temperature picker sheet](../temperature-picker-sheet.md)

# Functionality

* [Temperature entry](../../functionality/temperature-entry.md)

# Handler

Each wheel item scrolls to its index and calls `onChange(v)` after the delay.

# Instances And Placement

One instance renders per allowed integer value and per decimal value. The wheel
keeps many values inside a fixed-height vertical scroll viewport with a center
selection band.

# Citations

* `src/components/design/TempWheel.tsx`
