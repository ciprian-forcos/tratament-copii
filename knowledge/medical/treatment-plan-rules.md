---
type: Medical Rule
title: Treatment Plan Rules
description: Project timing assumptions for the app's small fever-helper flow, kept explicit so code and UI stay consistent.
resource: src/data/scheduleRules.ts
tags: [medical, timing, schedule, prototype, assumptions]
timestamp: 2026-06-15T19:00:00+03:00
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

# Implementation Impact

The timing path flows through [Schedule adapter and treatment plan](../implementation/schedule-adapter-and-dose-plan.md).

Known mismatches in latest `main`:

* `src/data/scheduleRules.ts` still has Panadol at 6 hours.
* `src/components/design/dosePlan.ts` still has a 2-hour cross-drug floor.
* `src/components/design/HomeB.tsx` still uses a 2-hour fallback countdown.
* `src/components/design/Step2.tsx` still includes Virodep.

# Connected UI

* [Step 2 treatment history](../ui/step2-treatment-history.md)
* [Plan card](../ui/plan-card.md)
* [Home screen](../ui/home-screen.md)

# Citations

* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
* [Medical source ledger](../references/medical-sources.md)
* `src/data/scheduleRules.ts`
* `src/components/design/dosePlan.ts`
