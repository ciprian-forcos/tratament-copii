---
type: Medical Rule
title: Treatment Plan Rules
description: Project timing assumptions for the app's small fever-helper flow, kept explicit so code and UI stay consistent.
resource: src/data/scheduleRules.ts
tags: [medical, timing, schedule, prototype, assumptions]
timestamp: 2026-06-15T23:40:00+03:00
---

# Project Rule

The current hardening target from human QA is:

* Nurofen / ibuprofen repeat interval: 8 hours.
* Panadol / paracetamol repeat interval: 8 hours.
* Minimum spacing between ibuprofen and paracetamol in the project plan: 4 hours.
* Virodep is not an antipyretic and should not appear in the last-dose panic step.

# Product Posture

This project is a small home-helper app with a few known medicines. It is not a
medical device, not a clinical decision system, and not a replacement for a
doctor's recommendation or the medicine leaflet.

The point of this graph is narrower: make the app's assumptions visible so the
code, UI copy, tests, and QA notes do not drift apart.

# Source Status

This is a project rule from human QA/domain judgment. External references in
[Medical source ledger](../references/medical-sources.md) are context only; they
do not override the project's chosen simplification and they do not turn this
repo into formal medical guidance.

# Implementation State

The timing path flows through [Schedule adapter and treatment plan](../implementation/schedule-adapter-and-dose-plan.md).

Phase 06 Lane A aligns the panic-flow planner with this rule:

* `src/data/scheduleRules.ts` uses 8h for Panadol and Nurofen.
* `src/components/design/dosePlan.ts` uses a 4h cross-drug floor.
* `src/components/design/Step2.tsx` excludes Virodep from previous-dose choices.
* `src/components/design/PlanCard.tsx` prevents recording a deferred first dose early.

Phase 07 Home next-dose:

* `src/components/design/nextPlannedDose.ts` reuses `buildPlan()` so Home
  shows the same next medicine and 4h floor as the plan card, only after
  the active child has recorded history.

# Connected UI

* [Step 2 treatment history](../ui/step2-treatment-history.md)
* [Plan card](../ui/plan-card.md)
* [Home screen](../ui/home-screen.md)

# Citations

* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
* [Medical source ledger](../references/medical-sources.md)
* `src/data/scheduleRules.ts`
* `src/components/design/dosePlan.ts`
