---
type: UI Button
title: Plan Record Dose Button
description: Records that the current planned dose was administered.
resource: src/components/design/PlanCard.tsx
tags: [button, plan-card, dose-recording]
timestamp: 2026-06-15T23:35:00+03:00
---

# Page

* [Plan card](../plan-card.md)

# Functionality

* [Dose recording](../../functionality/dose-recording.md)

# Handler

Calls `doseStore.record(...)` and then `onDone(now)` when the planned dose is
due. If the first planned dose is deferred by timing rules, the button is
disabled and does not record early.

# Citations

* `src/components/design/PlanCard.tsx`
* `src/components/design/doseStore.ts`
