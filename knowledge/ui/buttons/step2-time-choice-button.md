---
type: UI Button
title: Step 2 Time Choice Button
description: Current repeated time chip for previous-dose timing.
resource: src/components/design/Step2.tsx
tags: [button, step2, time, template, current-bug]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Step 2 treatment history](../step2-treatment-history.md)

# Functionality

* [Treatment history entry](../../functionality/treatment-history-entry.md)

# Handler

Each time chip calls `set({ time: t })`.

# Instances And Placement

One instance renders for each item in the current `TIMES` array, in a
four-column grid under the `la ce ora` label. This template is scheduled for
replacement by native real date/time entry in Phase 06.

# Phase 06 Direction

Replace this with native real date/time entry.

# Known Bug

* [Step 2 real date/time entry](../../bugs/step2-real-datetime-entry.md)

# Citations

* `src/components/design/Step2.tsx`
* `.planning/phases/06-hardening/06-01-treatment-history-and-timing-PLAN.md`
