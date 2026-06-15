---
type: UI Page
title: Temperature Picker Sheet
description: Bottom sheet wheel used from Home to edit the current temperature.
resource: src/components/design/TempWheel.tsx
tags: [ui, sheet, temperature]
timestamp: 2026-06-15T22:30:00+03:00
---

# User Job

Adjust the active child's temperature with wheel controls and either save or
cancel the change.

# Feature And Functionality

* [Panic treatment flow](../features/panic-treatment-flow.md)
* [Temperature entry](../functionality/temperature-entry.md)

# Buttons And Controls

* [Temperature wheel cancel button](buttons/temp-wheel-cancel-button.md)
* [Temperature wheel save button](buttons/temp-wheel-save-button.md)
* [Temperature wheel value control](buttons/temp-wheel-value-control.md)

# Repeated Instances

The integer and decimal wheels render one
[wheel value control](buttons/temp-wheel-value-control.md) per allowed value.
The wheels scroll vertically and snap to the center selection band; many values
stay inside the wheel viewport instead of expanding the sheet.

# Source Functions

* `TempWheel`
* `Wheel`
* `commit`
* `onChange`
* `onClose`

# Citations

* `src/components/design/TempWheel.tsx`
