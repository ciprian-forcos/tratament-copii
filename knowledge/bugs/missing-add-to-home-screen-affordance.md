---
type: Process Artifact
title: Missing Add-To-Home-Screen Affordance
description: QA bug node for the missing PWA install affordance.
resource: Bug reports/List
tags: [bug, v1, phase-06-hardening, pwa, home-screen]
timestamp: 2026-06-15T22:00:00+03:00
---

# Bug

The app has no visible add-to-home-screen affordance.

# Phase Mapping

* Phase: [V1 Phase 06 Hardening](../process/v1-phase-06-hardening.md)
* Suggested branch: `V1/phase-06-hardening/add-to-home`
* Suggested plan: `.planning/phases/06-hardening/06-04-install-and-medicines-PLAN.md`

# Touchpoints

* [Home screen](../ui/home-screen.md)
* [Tooling and deploy source map](../sources/tooling-and-deploy.md)
* `manifest.json`
* `src/App.tsx`

# Done When

The parent has a simple path to install/open the PWA from the home flow, without adding accounts, cloud, or notification scope.

# Citations

* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
* `manifest.json`
