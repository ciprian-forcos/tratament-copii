---
type: UI Page
title: Program Screen
description: Calm-mode 24h treatment schedule with start time, administered checkboxes, and schedule rules.
resource: src/components/design/ProgramScreen.tsx
tags: [ui, program, schedule, calm-mode]
timestamp: 2026-08-25T19:20:00+03:00
---

# User Job

See the next 24 hours of enabled medicines, tick a dose when given, and edit
timing rules. This is calm-mode work. Fever panic stays on the night home.

# Current Implementation

`ProgramScreen` uses `generateSchedule`, `doseStore` (including `unrecord`),
and additive keys `tratament-copii-start-time` and
`tratament-copii-schedule-rules`.

Calm home (`panic pref` off, or Auto before 20:00) is this screen. From the
night home, **Program** opens it as a subpage.

# Citations

* `src/components/design/ProgramScreen.tsx`
* `specs/scheduling.md`
* [V2 Phase 01 Program And Panic](../process/v2-phase-01-program-and-panic.md)
