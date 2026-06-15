---
type: UI Functionality
title: Dose Plan Generation
description: Converts active child, temperature context, and treatment history into the generated plan card.
resource: src/components/design/dosePlan.ts
tags: [functionality, plan, schedule, medical-rules]
timestamp: 2026-06-15T23:10:00+03:00
---

# Pages

* [Step 2 treatment history](../ui/step2-treatment-history.md)
* [Plan card](../ui/plan-card.md)

# Buttons

* [Step shell primary CTA button](../ui/buttons/step-shell-primary-cta-button.md)
* [Plan change something button](../ui/buttons/plan-change-something-button.md)

# Source Functions

* `buildPlan`
* `nextDoseFor`
* `calculateDose`

# Timing Policy

Dose scheduling uses:

* Nurofen same-drug interval: 8h.
* Panadol same-drug interval: 8h.
* Cross-drug floor between Nurofen and Panadol: 4h.

# Citations

* `src/components/design/dosePlan.ts`
* `src/components/design/scheduleAdapter.ts`
* [Treatment plan rules](../medical/treatment-plan-rules.md)
