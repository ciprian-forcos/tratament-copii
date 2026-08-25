---
type: Process Artifact
title: V2 Phase 01 Program And Panic
description: Restores the 24h treatment program and the calm/night home switch from the original product plan.
resource: .planning/phases/09-program-and-panic/09-00-OVERVIEW.md
tags: [process, phase, v2, program, panic-mode]
timestamp: 2026-08-25T19:20:00+03:00
---

# Branch

`V2/phase-01-program-and-panic`

# What Shipped

* Design B **Program** screen: 24h timeline from `generateSchedule`, mark
  administered via `doseStore`, start time, rule add/edit/delete.
* **Panic pref** (`auto` / `on` / `off`), stored in
  `tratament-copii-panic-pref`. Auto turns the fever home on at 20:00.
  Not included in share URLs.
* Calm home is Program. Night/forced-on home is the fever clock.
* Copii can toggle per-child `enabledMedications`. New children default to
  all catalog medicines.

# Still Not In This Plan

Cloud sync, Capacitor, and push notifications stay unscheduled.

# Citations

* `specs/scheduling.md`
* `specs/app-overview.md`
* `.planning/BRIEF.md` V2 panic mode
