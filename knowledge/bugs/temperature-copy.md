---
type: Process Artifact
title: Temperature Copy
description: QA bug node for changing "Masoara din nou" copy to "Temperatura".
resource: Bug reports/List
tags: [bug, v1, phase-06-hardening, home-screen, copy]
timestamp: 2026-06-15T23:58:00+03:00
---

# Bug

The home copy should say `Temperatura`, not `Masoara din nou`.

# Phase Mapping

* Phase: [V1 Phase 06 Hardening](../process/v1-phase-06-hardening.md)
* Suggested branch: `V1/phase-06-hardening/temperature-copy`
* Suggested plan: `.planning/phases/06-hardening/06-02-home-screen-hardening-PLAN.md`

# Touchpoints

* [Home screen](../ui/home-screen.md)
* `src/components/design/HomeB.tsx`

# Done When

The temperature control uses the requested label and still opens the temperature picker.

# Phase 06 Lane B State

Implemented in `src/components/design/ChildPill.tsx`; the temperature control
label is `Temperatura` and still opens `TempWheel`.

# Citations

* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
* `src/components/design/HomeB.tsx`
