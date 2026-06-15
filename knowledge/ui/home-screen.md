---
type: UI Page
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

# Feature And Functionality

* [3 AM use case](../product/3am-use-case.md)
* [Panic treatment flow](../features/panic-treatment-flow.md)
* [Child profile management](../features/child-profile-management.md)
* [PWA install affordance](../features/pwa-install-affordance.md)
* [Timeline and next dose display](../functionality/timeline-and-next-dose-display.md)
* [Temperature entry](../functionality/temperature-entry.md)
* [Child profile editing](../functionality/child-profile-editing.md)
* [Treatment plan rules](../medical/treatment-plan-rules.md)

# Buttons

* [Home child pill button](buttons/home-child-pill-button.md)
* [Home menu button](buttons/home-menu-button.md)
* [Home temperature button](buttons/home-temperature-button.md)
* [Home start treatment button](buttons/home-start-treatment-button.md)
* [Home install button](buttons/home-install-button.md) - planned in Phase 06.

# Source Functions

* `HomeB`
* `ChildPill`
* `MenuBtn`
* `TempWheel`
* `useNightTimeline`
* `anchorStrip`

# Citations

* `src/components/design/HomeB.tsx`
* `src/components/design/ChildPill.tsx`
* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
