---
type: Implementation Module
title: Application Source Map
description: Repo-wide implementation map for active app code, legacy retained source, stores, sharing, scheduling, and tests.
resource: src/
tags: [sources, implementation, react, vite, tests]
timestamp: 2026-06-15T21:30:00+03:00
---

# Active Route

`src/App.tsx` is the app shell. It renders:

* `ImportGate`
* `FlowProtoB`
* `HomeB`, `Step1`, `Step2`, `PlanCard`, `ChildrenScreen`, and the restored
  `MedicamenteTab` route

This is the active Design B flow, not the older three-tab app described in
`specs/app-overview.md`.

# State And Persistence

* `childStore.ts` owns child profiles and active child using the protected keys `tratament-copii-children` and `tratament-copii-active-child`.
* `doseStore.ts` owns administered doses using `tratament-copii-administered-doses`.
* `medicineStorage.ts` owns restored medicine reads/writes using `tratament-copii-medications`.
* `types.ts` defines child, medication, dose, and schedule-rule shapes.
* [Local storage and app state](../implementation/app-state-local-storage.md) is the data-safety node for these contracts.

# Treatment Planning Path

* `medications.ts` seeds default medicines.
* `scheduleRules.ts` seeds timing rules.
* `scheduleEngine.ts` projects generic schedule entries.
* `scheduleAdapter.ts` reads dose history and asks the engine for next same-medication eligibility.
* `dosePlan.ts` chooses the current/next antipyretic, calculates amounts, and applies cross-drug spacing.

The known timing drift is recorded in [Schedule adapter and treatment plan](../implementation/schedule-adapter-and-dose-plan.md) and [Treatment plan rules](../medical/treatment-plan-rules.md).

# Sharing Path

The share flow lives under `src/components/design/share/`:

* `encoder.ts` produces and decodes `v=1&d=<base64url>` payloads.
* `ShareSheet.tsx` builds share URLs.
* `ImportGate.tsx` handles import confirmation and query cleanup.
* `merge.ts` merges children and custom medications.

See [Share URL import and merge](../implementation/share-url-import-merge.md).

# Restored And Legacy Source

`MedicamenteTab.tsx` is restored through the active Design B route for medicine
add/edit/delete. `ProgramTab.tsx`, `CopiiTab.tsx`, and `hooks/useLocalStorage.ts`
remain retained reference source unless a future phase explicitly restores or
removes them.

# Tests

The repo has co-located Vitest test files under `src/components/design/` plus
focused component/helper tests for restored medicines.
The main gate commands are `npm run type-check`, `npm run test`, and
`npm run build`.

# Citations

* `src/App.tsx`
* `src/components/design/FlowProtoB.tsx`
* `src/components/design/HomeB.tsx`
* `src/components/design/PlanCard.tsx`
* `src/components/design/childStore.ts`
* `src/components/design/doseStore.ts`
* `src/components/design/medicineStorage.ts`
* `src/components/design/share/*`
* `src/components/MedicamenteTab.tsx`
* `src/components/ProgramTab.tsx`
* `src/components/CopiiTab.tsx`
* `src/**/*.test.ts`
* `src/**/*.test.tsx`
