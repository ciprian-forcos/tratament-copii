---
type: UI Element
title: Plan Card
description: The generated result card that tells the parent what to administer now and records the administered dose.
resource: src/components/design/PlanCard.tsx
tags: [ui, plan-card, dose-recording, safety]
timestamp: 2026-06-15T19:00:00+03:00
---

# User Job

The card should give one clear action: medicine, amount, and time. It should
also persist "Am dat doza" through [Dose history store](../implementation/dose-history-store.md).

# Current Implementation

The active implementation is `src/components/design/PlanCard.tsx`.

The card records an administered dose through `doseStore.record(...)`. That is
the connection that allows [Home screen](home-screen.md) to show real timeline
events.

# Known Issues

* The 112 / pediatrician banner is flagged for removal by QA because the rule is unsupported and not correct as written.
* Treatment timing depends on [Schedule adapter and treatment plan](../implementation/schedule-adapter-and-dose-plan.md), which currently conflicts with the latest QA target.

# Connected Concepts

* [3 AM use case](../product/3am-use-case.md)
* [Treatment plan rules](../medical/treatment-plan-rules.md)
* [Dosage versus treatment plan](../medical/dosage-vs-treatment-plan.md)

# Citations

* `src/components/design/PlanCard.tsx`
* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
