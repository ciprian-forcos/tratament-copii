---
phase: v1-phase-06-hardening
plan: 06-01
status: complete
date: 2026-06-15
---

# Summary: Treatment History And Timing (06-01)

## What Changed

* Step 2 title is `Ai mai administrat altceva?`.
* Previous-dose mode uses a native `datetime-local` input bound to `lastAt`.
* Previous-dose medication choices are limited to timed antipyretics: Nurofen and Panadol.
* Virodep and Novocalmin are not shown in the previous-dose medication list.
* Dose scheduling uses 8h same-drug intervals for Nurofen and Panadol, plus a 4h cross-drug floor.
* PlanCard shows a future time and disables dose recording when the first planned dose is deferred by the 4h floor.
* The old Step 2 time-choice node is retained as the datetime input control/template node; no per-rendered time button nodes are created.

## Verification

* `npm run test -- Step2`
* `npm run test -- PlanCard`
* `npm run test -- dosePlan`
* `npm run test -- scheduleAdapter`
* `npm run test -- doseStore`
* `npm run type-check`
* `npm run build`
