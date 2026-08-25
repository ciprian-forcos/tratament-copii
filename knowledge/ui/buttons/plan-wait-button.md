---
type: UI Button
title: Plan Wait Button
description: Returns Home when the next planned dose is still deferred, after remembering the last dose.
resource: src/components/design/PlanCard.tsx
tags: [button, plan-card, wait, episode]
timestamp: 2026-08-25T19:10:00+03:00
---

# Page

* [Plan card](../plan-card.md)

# Handler

`waitForDose` in `PlanCard` persists a Step 2 last dose if needed, then
calls `onWait`. `FlowProtoB` sends the parent Home.

# Visibility

Rendered only when the next dose is not yet due and `onWait` is provided.

# Citations

* `src/components/design/PlanCard.tsx`
* [V1 Phase 08 Treatment Flow](../../process/v1-phase-08-treatment-flow.md)
