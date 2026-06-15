---
type: Feature
title: Child Profile Management
description: Calm-mode child setup, active child selection, and child profile editing.
resource: src/components/design/ChildrenScreen.tsx
tags: [feature, children, profiles, calm-mode]
timestamp: 2026-06-15T22:30:00+03:00
---

# Purpose

Supports multiple child profiles so dosing and schedules use the active child's
weight, age, and enabled medicines.

# Source Spec

* [Specs corpus](../sources/specs-corpus.md)
* [V1 scope](../product/v1-scope.md)

# Pages

* [Children screen](../ui/children-screen.md)
* [Child profile editor sheet](../ui/child-profile-editor-sheet.md)
* [Home screen](../ui/home-screen.md)
* [Step 1 temperature entry](../ui/step1-temperature-entry.md)

# Functionality

* [Child profile editing](../functionality/child-profile-editing.md)
* [Temperature entry](../functionality/temperature-entry.md)

# Source Functions

* `ChildrenScreen`
* `ChildEditor`
* `ChildPill`
* `childStore.add`
* `childStore.patchActive`
* `childStore.setActive`
* `childStore.remove`

# Citations

* `specs/children-profiles.md`
* `src/components/design/childStore.ts`
* `src/components/design/ChildrenScreen.tsx`
