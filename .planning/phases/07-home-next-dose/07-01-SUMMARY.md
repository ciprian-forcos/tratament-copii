---
phase: v1-phase-07-home-next-dose
plan: 07-01
status: complete
date: 2026-08-25
---

# Summary: Home Next Dose From History (07-01)

## What Changed

* Added `nextPlannedDose({ child, now, doses })`. No history for the active
  child → `null`. Otherwise the latest administered dose is fed into
  `buildPlan()` and Home uses `plan.now`.
* Home derives the next dose from `doseStore` when `nextDose` is omitted.
  Explicit `nextDose` remains a test override.
* After a recorded dose, Home shows `mai sunt …` until the 4h floor, then
  `dă {med} acum` instead of `mai sunt 0m`.
* The CTA becomes `Următoarea doză · HH:MM` once history exists; cold start
  stays `Începe tratamentul`.
* Removed the stale PlanCard persist TODO in `FlowProtoB` (recording already
  happens in `PlanCard` via `doseStore.record`).

## Verification

* `npm run test -- nextPlannedDose`
* `npm run test -- HomeB`
* `npm run type-check`
* `npm run lint`
* `npm run test`
* `npm run build`
