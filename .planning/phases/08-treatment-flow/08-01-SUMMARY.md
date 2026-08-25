---
phase: v1-phase-08-treatment-flow
plan: 08-01
status: complete
date: 2026-08-25
---

# Summary: Treatment Episode Flow (08-01)

## What Changed

* Added `episode.ts`: last dose in the current 24h episode, Step 2 seed, and
  duplicate-minute check.
* `nextPlannedDose` ignores doses older than 24h so Home starts a new episode.
* PlanCard builds from stored history; Step 2 is only a seed on first start.
* Deferred plans offer `Voi aștepta`, which writes the last dose and returns Home.
* Recording a due plan also persists a Step 2 last dose if it was not stored yet.
* Home CTA opens the plan card during an episode, and the wizard otherwise.

## Verification

* `npm run test -- episode`
* `npm run test -- nextPlannedDose`
* `npm run test -- PlanCard`
* `npm run test -- FlowProtoB`
* `npm run type-check`
* `npm run lint`
* `npm run test`
* `npm run build`
