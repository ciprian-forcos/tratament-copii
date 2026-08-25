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

`PlanCard` records the due dose when the parent taps `Am dat doza`. A Step 2
last dose is stored at the same time if it is not already in history. When
`buildPlan` defers the next dose, `Am dat doza` stays disabled; `Voi aștepta`
stores the last dose (if seeded) and returns Home.

# Implementation

* [Dose history store](../implementation/dose-history-store.md)

# Citations

* `src/components/design/PlanCard.tsx`
* `src/components/design/doseStore.ts`
