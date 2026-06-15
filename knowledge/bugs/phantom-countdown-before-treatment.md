---
type: Process Artifact
title: Phantom Countdown Before Treatment Starts
description: QA bug node for HomeB showing a next-dose countdown before treatment exists.
resource: Bug reports/List
tags: [bug, v1, phase-06-hardening, home-screen, countdown]
timestamp: 2026-06-15T23:58:00+03:00
---

# Bug

[Home screen](../ui/home-screen.md) shows a countdown before treatment has started.

# Phase Mapping

* Phase: [V1 Phase 06 Hardening](../process/v1-phase-06-hardening.md)
* Suggested branch: `V1/phase-06-hardening/home-countdown`
* Suggested plan: `.planning/phases/06-hardening/06-02-home-screen-hardening-PLAN.md`

# Touchpoints

* `src/components/design/HomeB.tsx`
* `src/components/design/HomeB.test.tsx`

# Source Fact

The old `HomeB.tsx` fallback used `now + 2h` and `Panadol` when `nextDose` was missing.

# Done When

No next-dose countdown appears until there is an actual plan or recorded treatment history.

# Phase 06 Lane B State

Implemented in `src/components/design/HomeB.tsx`; missing `nextDose` renders
no countdown, no next marker, and no next-dose time CTA.

# Citations

* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
* `src/components/design/HomeB.tsx`
