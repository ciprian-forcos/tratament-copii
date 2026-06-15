---
type: UI Element
title: Children Screen
description: Calm-mode screen for child profiles, active child selection, active medications, and share entry.
resource: src/components/design/ChildrenScreen.tsx
tags: [ui, children, calm-mode, sharing, bsa]
timestamp: 2026-06-15T19:00:00+03:00
---

# User Job

The parent can manage child name, age, weight, active child selection, and
sharing from this screen. This is calm-mode work, not the panic flow itself.

# Current Implementation

The active implementation is `src/components/design/ChildrenScreen.tsx`.

Current QA issue:

* BSA and estimated height are visible, but QA says this is not needed in the children menu.

# Connected Concepts

* [V1 scope](../product/v1-scope.md)
* [Share sheet](share-sheet.md)
* [Local storage and app state](../implementation/app-state-local-storage.md)

# Ponytail Constraint

Removing BSA display is preferred over explaining it. If the active user does
not need the value, the best UI is no UI.

# Citations

* `src/components/design/ChildrenScreen.tsx`
* `src/components/design/ChildrenScreen.test.tsx`
* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
