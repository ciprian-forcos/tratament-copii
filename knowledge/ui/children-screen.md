---
type: UI Page
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
* [Child profile management](../features/child-profile-management.md)
* [Share by URL](../features/share-by-url.md)
* [Medicine management](../features/medicine-management.md)
* [Child profile editing](../functionality/child-profile-editing.md)
* [Share sheet](share-sheet.md)
* [Local storage and app state](../implementation/app-state-local-storage.md)

# Buttons

* [Children share button](buttons/children-share-button.md)
* [Children edit child button](buttons/children-edit-child-button.md)
* [Children set active button](buttons/children-set-active-button.md)
* [Children add child button](buttons/children-add-child-button.md)
* [Children back button](buttons/children-back-button.md)
* [Children medicines button](buttons/children-medicines-button.md) - planned in Phase 06.

# Repeated Instances

Child cards render in a vertical scroll area. Each child card owns its own
[edit](buttons/children-edit-child-button.md) button; inactive child cards also
show a [set active](buttons/children-set-active-button.md) button in the card's
action row. If there are many children, the list scrolls while the footer
actions remain after the list content.

# Source Functions

* `ChildrenScreen`
* `handleAdd`
* `childStore.setActive`
* `ShareSheet`
* `ChildEditor`

# Ponytail Constraint

Removing BSA display is preferred over explaining it. If the active user does
not need the value, the best UI is no UI.

# Citations

* `src/components/design/ChildrenScreen.tsx`
* `src/components/design/ChildrenScreen.test.tsx`
* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
