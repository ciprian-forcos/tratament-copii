---
type: Process Artifact
title: Timeline Now Marker Anchoring
description: QA bug node for the night timeline now marker appearing at the far right.
resource: Bug reports/List
tags: [bug, v1, phase-06-hardening, home-screen, timeline]
timestamp: 2026-06-15T22:00:00+03:00
---

# Bug

The timeline `now` marker appears at the far right; QA expects middle anchoring.

# Phase Mapping

* Phase: [V1 Phase 06 Hardening](../process/v1-phase-06-hardening.md)
* Suggested branch: `V1/phase-06-hardening/timeline-now`
* Suggested plan: `.planning/phases/06-hardening/06-02-home-screen-hardening-PLAN.md`

# Touchpoints

* [Home screen](../ui/home-screen.md)
* `src/components/design/HomeB.tsx`
* `src/components/design/useNightTimeline.ts`

# Done When

The strip frames recent/pending treatment around the current moment instead of pushing `now` to the edge.

# Citations

* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
* `src/components/design/HomeB.tsx`
