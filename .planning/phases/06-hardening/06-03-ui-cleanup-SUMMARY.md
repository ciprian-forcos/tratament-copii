---
phase: v1-phase-06-hardening
plan: 06-03
status: complete
date: 2026-06-15
---

# Summary: UI Cleanup (06-03)

## What Changed

* Removed the BSA / estimated-height row from child cards in `ChildrenScreen`.
* Removed the unsupported `112 / pediatrician` banner from `PlanCard`.
* Kept the existing child management and PlanCard dose-recording flows intact.

## Verification

* `npm run test -- ChildrenScreen`
* `npm run test -- PlanCard`
