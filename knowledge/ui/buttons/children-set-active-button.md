---
type: UI Button
title: Children Set Active Button
description: Repeated child-card button that makes a child active.
resource: src/components/design/ChildrenScreen.tsx
tags: [button, children, active-child, template]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Children screen](../children-screen.md)

# Functionality

* [Child profile editing](../../functionality/child-profile-editing.md)

# Handler

Calls `childStore.setActive(child.id)`.

# Instances And Placement

One instance appears only on inactive child cards in the action row. The active
child card replaces this button with the active badge, so the user cannot
re-select the already-active child from this control.

# Citations

* `src/components/design/ChildrenScreen.tsx`
