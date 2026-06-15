---
type: UI Button
title: Home Temperature Button
description: Opens the temperature picker sheet from Home.
resource: src/components/design/HomeB.tsx
tags: [button, home, temperature]
timestamp: 2026-06-15T23:58:00+03:00
---

# Page

* [Home screen](../home-screen.md)

# Destination

* [Temperature picker sheet](../temperature-picker-sheet.md)

# Functionality

* [Temperature entry](../../functionality/temperature-entry.md)

# Handler

`ChildPill` calls `onTemperatureClick`; `HomeB` sets `pickerOpen` and renders
`TempWheel`. The visible control label is `Temperatura`.

# Phase 06 Lane B State

[Temperature copy](../../bugs/temperature-copy.md) is implemented for Home.

# Citations

* `src/components/design/HomeB.tsx`
