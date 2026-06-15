---
type: UI Functionality
title: Dose Recording
description: Records the administered dose so later home timeline and schedule checks use real history.
resource: src/components/design/PlanCard.tsx
tags: [functionality, dose-recording, timeline]
timestamp: 2026-06-15T23:35:00+03:00
---

# Page

* [Plan card](../ui/plan-card.md)

# Button

* [Plan record dose button](../ui/buttons/plan-record-dose-button.md)

# Source Functions

* `doseStore.record`
* `PlanCard`
* `onDone`

# Current Behavior

`PlanCard` records only when the planned first dose is due. When `buildPlan`
defers the first dose into the future, the record button is disabled and no
administered dose is written early.

# Implementation

* [Dose history store](../implementation/dose-history-store.md)

# Citations

* `src/components/design/PlanCard.tsx`
* `src/components/design/doseStore.ts`
