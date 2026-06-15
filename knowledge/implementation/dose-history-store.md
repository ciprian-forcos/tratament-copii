---
type: Implementation Module
title: Dose History Store
description: Local administered-dose persistence powers the night timeline and same-medication repeat checks.
resource: src/components/design/doseStore.ts
tags: [implementation, dose-history, local-storage, timeline]
timestamp: 2026-06-15T19:00:00+03:00
---

# Responsibility

`doseStore` records administered doses, lists them by child and time window,
persists them to localStorage, and notifies subscribers.

# Consumers

* [Home screen](../ui/home-screen.md) uses dose history through `useNightTimeline`.
* [Plan card](../ui/plan-card.md) records "Am dat doza".
* [Schedule adapter and treatment plan](schedule-adapter-and-dose-plan.md) reads dose history to determine same-medication repeat eligibility.

# Data Shape

The store owns `AdministeredDose` records with child id, medication id,
scheduled time, administered time, and generated id.

# Citations

* `src/components/design/doseStore.ts`
* `src/components/design/useNightTimeline.ts`
* `src/components/design/PlanCard.tsx`
* `src/types.ts`
