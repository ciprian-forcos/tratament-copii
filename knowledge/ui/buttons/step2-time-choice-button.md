---
type: UI Control
title: Step 2 Datetime Input Control
description: Native previous-dose datetime input replacing the old repeated time-choice button template.
resource: src/components/design/Step2.tsx
tags: [control, step2, time, template, datetime]
timestamp: 2026-06-15T23:10:00+03:00
---

# Page

* [Step 2 treatment history](../step2-treatment-history.md)

# Functionality

* [Treatment history entry](../../functionality/treatment-history-entry.md)

# Handler

The active control is a single native `datetime-local` input bound to `lastAt`.

# Instances And Placement

Do not create per-rendered-instance nodes for previous-dose times. This node
documents the single native datetime input control that replaced the old
repeated time-chip template.

# Phase 06 State

Native real date/time entry is implemented for previous-dose timing.

# Citations

* `src/components/design/Step2.tsx`
* `.planning/phases/06-hardening/06-01-treatment-history-and-timing-PLAN.md`
