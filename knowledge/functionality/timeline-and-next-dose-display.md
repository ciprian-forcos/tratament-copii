---
type: UI Functionality
title: Timeline And Next Dose Display
description: Shows recorded doses, current time, and the next planned dose on the home screen.
resource: src/components/design/HomeB.tsx
tags: [functionality, timeline, next-dose, home]
timestamp: 2026-06-15T22:30:00+03:00
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

# Known Bugs

* [Phantom countdown before treatment starts](../bugs/phantom-countdown-before-treatment.md)
* [Timeline now marker anchoring](../bugs/timeline-now-marker-anchoring.md)

# Citations

* `src/components/design/HomeB.tsx`
* `src/components/design/useNightTimeline.ts`
