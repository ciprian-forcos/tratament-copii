---
type: Process Artifact
title: Home Controls And Fake Status Icons
description: QA bug node for merged child/temp/age controls and fake statusbar icons.
resource: Bug reports/List
tags: [bug, v1, phase-06-hardening, home-screen, controls]
timestamp: 2026-06-15T23:58:00+03:00
---

# Bug

Temperature, age, and child controls need to be separate. Fake status icons should disappear.

# Phase Mapping

* Phase: [V1 Phase 06 Hardening](../process/v1-phase-06-hardening.md)
* Suggested branch: `V1/phase-06-hardening/home-controls`
* Suggested plan: `.planning/phases/06-hardening/06-02-home-screen-hardening-PLAN.md`

# Touchpoints

* `src/components/design/HomeB.tsx`
* `src/components/design/ChildPill.tsx`
* `src/components/design/StatusBar.tsx`

# Source Fact

The old `ChildPill.tsx` combined child name, age, and temperature.
The old `StatusBar.tsx` rendered fake signal/battery icons.

# Done When

Child identity, age/profile editing, and temperature editing are visibly distinct controls, and fake device status icons are gone.

# Phase 06 Lane B State

Implemented in `src/components/design/ChildPill.tsx`,
`src/components/design/HomeB.tsx`, and `src/components/design/StatusBar.tsx`.

# Citations

* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
* `src/components/design/ChildPill.tsx`
* `src/components/design/StatusBar.tsx`
