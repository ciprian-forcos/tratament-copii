---
type: Feature
title: Panic Treatment Flow
description: The main fever episode path from home to temperature, treatment history, plan generation, and dose recording.
resource: src/components/design/FlowProtoB.tsx
tags: [feature, panic-flow, v1, fever]
timestamp: 2026-06-15T22:30:00+03:00
---

# Purpose

Implements the [3 AM use case](../product/3am-use-case.md): confirm child and
temperature, answer treatment history, get one action, then record the dose.

# Source Spec

* [Specs corpus](../sources/specs-corpus.md)
* [V1 scope](../product/v1-scope.md)

# Pages

* [Home screen](../ui/home-screen.md)
* [Step 1 temperature entry](../ui/step1-temperature-entry.md)
* [Step 2 treatment history](../ui/step2-treatment-history.md)
* [Plan card](../ui/plan-card.md)
* [Temperature picker sheet](../ui/temperature-picker-sheet.md)
* [Child profile editor sheet](../ui/child-profile-editor-sheet.md)

# Functionality

* [Temperature entry](../functionality/temperature-entry.md)
* [Treatment history entry](../functionality/treatment-history-entry.md)
* [Dose plan generation](../functionality/dose-plan-generation.md)
* [Dose recording](../functionality/dose-recording.md)
* [Timeline and next dose display](../functionality/timeline-and-next-dose-display.md)

# Source Functions

* `FlowProtoB`
* `HomeB`
* `Step1`
* `Step2`
* `PlanCard`
* `buildPlan`
* `doseStore.record`

# Citations

* `.planning/BRIEF.md`
* `specs/app-overview.md`
* `specs/scheduling.md`
* `src/components/design/FlowProtoB.tsx`
