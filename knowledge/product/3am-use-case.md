---
type: Product Concept
title: 3 AM Use Case
description: The app is optimized for a tired parent who needs one safe next action during a fever episode.
resource: .planning/BRIEF.md
tags: [product, panic-flow, parent, v1]
timestamp: 2026-06-15T19:00:00+03:00
---

# Purpose

The central product promise is a low-friction fever-treatment guide for a
Romanian-speaking parent under stress. The parent should be able to open the app,
confirm the child and temperature, answer treatment-history questions, and get
one clear [plan card](../ui/plan-card.md).

This concept owns the "why" behind the interface. If a feature does not reduce
decision load in this scenario, it belongs outside V1 or behind calm-mode setup.

# Connected Concepts

* The panic path is implemented by [Home screen](../ui/home-screen.md), [Step 2 treatment history](../ui/step2-treatment-history.md), and [Plan card](../ui/plan-card.md).
* The medical behavior must follow [Treatment plan rules](../medical/treatment-plan-rules.md).
* Sharing exists because two parents may need the same state; see [Share sheet](../ui/share-sheet.md).

# Acceptance Questions

* Can a parent reach a plan in under 30 seconds?
* Does the app avoid extra explanations and unsupported warnings?
* Does the selected action match the active child, weight, temperature, and last administered treatment?

# Citations

* `.planning/BRIEF.md`
* `.planning/V1_ACCEPTANCE.md`
