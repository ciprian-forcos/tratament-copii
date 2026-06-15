---
type: UI Page
title: Plan Card
description: The generated result card that tells the parent what to administer now and records the administered dose.
resource: src/components/design/PlanCard.tsx
tags: [ui, plan-card, dose-recording, safety]
timestamp: 2026-06-15T23:55:00+03:00
---

# User Job

The card should give one clear action: medicine, amount, and time. It should
also persist "Am dat doza" through [Dose history store](../implementation/dose-history-store.md).

# Current Implementation

The active implementation is `src/components/design/PlanCard.tsx`.

The card records an administered dose through `doseStore.record(...)`. That is
the connection that allows [Home screen](home-screen.md) to show real timeline
events.

If the first planned dose is deferred by the 4h cross-drug floor, the card shows
the scheduled time instead of `acum` and disables `Am dat doza` until that time
is due.

# Current Notes

* Treatment timing depends on [Schedule adapter and treatment plan](../implementation/schedule-adapter-and-dose-plan.md).
* The unsupported `112 / pediatrician` banner is not rendered.

# Connected Concepts

* [3 AM use case](../product/3am-use-case.md)
* [Panic treatment flow](../features/panic-treatment-flow.md)
* [Dose plan generation](../functionality/dose-plan-generation.md)
* [Dose recording](../functionality/dose-recording.md)
* [Treatment plan rules](../medical/treatment-plan-rules.md)
* [Dosage versus treatment plan](../medical/dosage-vs-treatment-plan.md)

# Buttons

* [Plan back button](buttons/plan-back-button.md)
* [Plan record dose button](buttons/plan-record-dose-button.md)
* [Plan change something button](buttons/plan-change-something-button.md)

# Source Functions

* `PlanCard`
* `buildPlan`
* `doseStore.record`
* `onDone`

# Citations

* `src/components/design/PlanCard.tsx`
* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
