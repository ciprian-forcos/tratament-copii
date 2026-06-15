---
type: Process Artifact
title: Ponytail Audit Observations
description: Repo-wide simplification targets from the first Ponytail audit pass.
resource: conversation:2026-06-15-ponytail-audit
tags: [process, ponytail, audit, simplification, yagni]
timestamp: 2026-06-15T21:00:00+03:00
---

# Purpose

This node records repo-wide simplification observations from the first
`ponytail-audit` pass. It is an audit ledger, not an implementation change.

# Highest-Value Cuts

* Legacy tab UI appears unused by the active app shell: `CopiiTab`,
  `MedicamenteTab`, `ProgramTab`, and `useLocalStorage`.
* `lucide-react` appears tied to that legacy tab UI and may become removable
  after the legacy tabs are deleted.
* `date-fns` is listed as a dependency but current source imports do not use it.

# Active-Flow Simplification Candidates

* [Home screen](../ui/home-screen.md) uses a custom [temperature wheel](../ui/home-screen.md)
  through `TempWheel`; a native numeric input may cover the job with much less
  code.
* [Step 2 treatment history](../ui/step2-treatment-history.md) still offers
  Virodep even though [Treatment plan rules](../medical/treatment-plan-rules.md)
  say it is not an antipyretic.
* [Plan card](../ui/plan-card.md) still has an unsupported emergency banner
  that QA already flagged for removal.
* `Step1` duplicates temperature persistence even though `FlowProtoB` already
  passes an `onChange` handler backed by `childStore.patchActive`.

# Scheduling Scope

The generic schedule engine supports `after_medication`, `once_per_day`, and
`times_per_day`, which came from broader medicine-program management. For V1,
[V1 scope](../product/v1-scope.md) and [Treatment plan rules](../medical/treatment-plan-rules.md)
point toward a smaller fever-helper model: antipyretic repeat intervals plus
recorded dose history.

# Boundary

Do not simplify away validation, data-loss prevention, share-import merge
safety, accessibility, or explicit medical assumptions.

# Connected Concepts

* [Ponytail simplification discipline](../references/ponytail.md)
* [V1 scope](../product/v1-scope.md)
* [Schedule adapter and treatment plan](../implementation/schedule-adapter-and-dose-plan.md)
* [Version and phase naming](version-phase-branch-naming.md)

# Citations

* Conversation audit output from `ponytail:ponytail-audit`, 2026-06-15.
* `src/App.tsx`
* `src/components/CopiiTab.tsx`
* `src/components/MedicamenteTab.tsx`
* `src/components/ProgramTab.tsx`
* `src/components/design/TempWheel.tsx`
* `src/utils/scheduleEngine.ts`
* `package.json`
