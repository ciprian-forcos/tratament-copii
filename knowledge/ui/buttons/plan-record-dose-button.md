---
type: UI Button
title: Plan Record Dose Button
description: Records that the current planned dose was administered.
resource: src/components/design/PlanCard.tsx
tags: [button, plan-card, dose-recording]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Plan card](../plan-card.md)

# Functionality

* [Dose recording](../../functionality/dose-recording.md)

# Handler

Calls `doseStore.record(...)` and then `onDone(now)`.

# Citations

* `src/components/design/PlanCard.tsx`
* `src/components/design/doseStore.ts`
