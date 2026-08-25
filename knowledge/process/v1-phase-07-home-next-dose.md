---
type: Process Artifact
title: V1 Phase 07 Home Next Dose
description: After Phase 06 removed the fake countdown, Home now derives the real next dose from recorded history.
resource: .planning/phases/07-home-next-dose/07-00-OVERVIEW.md
tags: [process, phase, v1, home-screen, next-dose]
timestamp: 2026-08-25T17:20:00+03:00
---

# Branch

`V1/phase-07-home-next-dose`

# Scope

Wire Home's next-dose countdown to administered-dose history using the
existing `buildPlan()` policy. Do not change medical intervals, localStorage
keys, or the share-URL format.

# Planning Files

* [Phase 07 overview](../../.planning/phases/07-home-next-dose/07-00-OVERVIEW.md)
* [07-01 home next dose from history](../../.planning/phases/07-home-next-dose/07-01-PLAN.md)
* [07-01 summary](../../.planning/phases/07-home-next-dose/07-01-SUMMARY.md)

# Why This Phase Exists

Phase 06 Lane B deleted the fake `now + 2h` / `Panadol` fallback. Home accepted
an optional `nextDose` prop, but `FlowProtoB` never passed one, so a parent who
had just recorded a dose returned to a Home that looked untreated.

# Product Rule

No countdown until the active child has at least one recorded dose. After
that, the next medicine is the other of the Nurofen/Panadol pair, at last
dose + 4h, matching [Treatment plan rules](../medical/treatment-plan-rules.md).

# Citations

* `.planning/phases/07-home-next-dose/07-01-PLAN.md`
* `src/components/design/nextPlannedDose.ts`
* `src/components/design/HomeB.tsx`
