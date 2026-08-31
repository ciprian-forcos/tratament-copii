---
type: UI Page
title: Home Screen
description: Main panic-mode surface with active child, temperature entry, countdown, clock, and night timeline.
resource: src/components/design/HomeB.tsx
tags: [ui, home, panic-flow, countdown, timeline]
timestamp: 2026-06-15T23:58:00+03:00
---

# User Job

The home screen should answer: which child is active, what is the current
temperature, what happened tonight, and what action starts the panic flow.

# Current Implementation

The active implementation is `src/components/design/HomeB.tsx`.

Phase 06 Lane B + Phase 07 state:

* No countdown or next-dose marker renders before the active child has recorded treatment.
* After a recorded dose, Home derives the next medicine/time from history via `nextPlannedDose`.
* The timeline frames `acum` in the center of the 12-hour strip.
* The now-dot stays on the track; the `acum` label sits below the timeline so it does not cover nearby dose dots.
* Child identity/menu, profile details, and temperature editing are separate controls.
* Temperature copy is `Temperatura`.
* `StatusBar` keeps time text and does not render fake signal/battery icons.

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
* [Home profile button](buttons/home-profile-button.md)
* [Home menu button](buttons/home-menu-button.md)
* [Home temperature button](buttons/home-temperature-button.md)
* [Home start treatment button](buttons/home-start-treatment-button.md)
* [Home install button](buttons/home-install-button.md)

# Phase 06 Lane D State

Home includes the PWA install entry in the footer above the treatment-start
button. It is hidden in standalone mode and falls back to manual browser-menu
guidance when the native install prompt is unavailable.

# Source Functions

* `HomeB`
* `handleInstall`
* `ChildPill`
* `MenuBtn`
* `TempWheel`
* `useNightTimeline`
* `nextPlannedDose`
* `anchorStrip`

# Citations

* `src/components/design/HomeB.tsx`
* `src/components/design/ChildPill.tsx`
* `src/components/design/nextPlannedDose.ts`
* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
* [V1 Phase 07 Home Next Dose](../process/v1-phase-07-home-next-dose.md)
