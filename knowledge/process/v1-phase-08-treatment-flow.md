---
type: Process Artifact
title: V1 Phase 08 Treatment Flow
description: Completes the fever episode so later doses continue from Home instead of restarting the wizard.
resource: .planning/phases/08-treatment-flow/08-00-OVERVIEW.md
tags: [process, phase, v1, treatment-flow, episode]
timestamp: 2026-08-25T19:10:00+03:00
---

# Branch

`V1/phase-08-treatment-flow`

# Scope

Wire an ongoing treatment episode on top of Phase 07 next-dose display.

# Planning Files

* [Phase 08 overview](../../.planning/phases/08-treatment-flow/08-00-OVERVIEW.md)
* [08-01 treatment episode](../../.planning/phases/08-treatment-flow/08-01-PLAN.md)
* [08-01 summary](../../.planning/phases/08-treatment-flow/08-01-SUMMARY.md)

# Episode Rule

A child is in episode when the latest administered (or waited) dose is within
24 hours. Inside that window, Home continues to the plan card. After 24 hours,
Home starts the wizard again.

# Citations

* `src/components/design/episode.ts`
* `src/components/design/FlowProtoB.tsx`
* `src/components/design/PlanCard.tsx`
