---
type: Process Artifact
title: Unsupported Emergency Banner
description: QA bug node for removing the unsupported 112/pediatrician banner from the plan card.
resource: Bug reports/List
tags: [bug, v1, phase-06-hardening, plan-card, safety-copy]
timestamp: 2026-06-15T22:00:00+03:00
---

# Bug

The `112 / pediatrician` banner should be removed.

# Phase Mapping

* Phase: [V1 Phase 06 Hardening](../process/v1-phase-06-hardening.md)
* Suggested branch: `V1/phase-06-hardening/remove-emergency-banner`
* Suggested plan: `.planning/phases/06-hardening/06-03-ui-cleanup-PLAN.md`

# Touchpoints

* [Plan card](../ui/plan-card.md)
* [3 AM use case](../product/3am-use-case.md)
* `src/components/design/PlanCard.tsx`

# Done When

The plan card no longer shows the unsupported banner, and no replacement copy invents medical guidance.

# Citations

* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
* `src/components/design/PlanCard.tsx`
