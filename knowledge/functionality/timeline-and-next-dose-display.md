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
* `anchorStrip`
* `diffHHMM`
* `fmtHHMM`

# Current Behavior

Home shows no fake next-dose countdown before treatment exists. When a real
`nextDose` is provided, it renders the countdown, next marker, and next-dose CTA
time. The timeline frames `acum` at the center of the strip.

# Citations

* `src/components/design/HomeB.tsx`
* `src/components/design/useNightTimeline.ts`
