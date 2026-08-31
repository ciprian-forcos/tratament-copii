---
type: UI Functionality
title: Timeline And Next Dose Display
description: Shows recorded doses, current time, and the next planned dose on the home screen.
resource: src/components/design/HomeB.tsx
tags: [functionality, timeline, next-dose, home]
timestamp: 2026-06-15T23:58:00+03:00
---

# Page

* [Home screen](../ui/home-screen.md)

# Buttons

* [Home start treatment button](../ui/buttons/home-start-treatment-button.md)

# Source Functions

* `HomeB`
* `useNightTimeline`
* `nextPlannedDose`
* `anchorStrip`
* `diffHHMM`
* `fmtHHMM`

# Current Behavior

Home shows no fake next-dose countdown before treatment exists. After the
active child has a recorded dose, `nextPlannedDose` feeds the latest history
into `buildPlan()` and Home renders the countdown, next marker, and
next-dose CTA time. If that time is already due, the copy is `dă {med} acum`
instead of `mai sunt 0m`. The timeline frames a short vertical now-tick at
the center of the strip curve, drawn behind dose marks, except when the next
dose is already due — then the pulse-dot is the now mark — or when any dose
mark is within 40 minutes of now, so the tick does not show through nearby
`HH:MM` labels. The `acum` label sits below
the track.

# Citations

* `src/components/design/HomeB.tsx`
* `src/components/design/useNightTimeline.ts`
* `src/components/design/nextPlannedDose.ts`
* [V1 Phase 07 Home Next Dose](../process/v1-phase-07-home-next-dose.md)
