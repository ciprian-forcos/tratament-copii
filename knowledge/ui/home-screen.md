---
type: UI Element
title: Home Screen
description: Main panic-mode surface with active child, temperature entry, countdown, clock, and night timeline.
resource: src/components/design/HomeB.tsx
tags: [ui, home, panic-flow, countdown, timeline]
timestamp: 2026-06-15T19:00:00+03:00
---

# User Job

The home screen should answer: which child is active, what is the current
temperature, what happened tonight, and what action starts the panic flow.

# Current Implementation

The active implementation is `src/components/design/HomeB.tsx`.

Current issues from [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md):

* A phantom countdown appears before a treatment exists.
* The "now" marker is anchored by the 21:00 to 09:00 strip and can appear at an edge.
* Temperature, age, and child selection are not separated into the expected three controls.
* Copy says "masoara din nou"; QA wants "Temperatura".

# Connected Implementation

* [Dose history store](../implementation/dose-history-store.md)
* [Schedule adapter and treatment plan](../implementation/schedule-adapter-and-dose-plan.md)

# Connected Rules

* [3 AM use case](../product/3am-use-case.md)
* [Treatment plan rules](../medical/treatment-plan-rules.md)

# Citations

* `src/components/design/HomeB.tsx`
* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
