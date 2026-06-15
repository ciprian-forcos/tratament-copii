---
type: UI Button
title: Children Edit Child Button
description: Repeated child-card button that opens the child editor for that child.
resource: src/components/design/ChildrenScreen.tsx
tags: [button, children, profile-editing, template]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Children screen](../children-screen.md)

# Destination

* [Child profile editor sheet](../child-profile-editor-sheet.md)

# Functionality

* [Child profile editing](../../functionality/child-profile-editing.md)

# Handler

Calls `childStore.setActive(child.id)` and opens `ChildEditor`.

# Instances And Placement

One instance appears inside each child card's action row on
[Children screen](../children-screen.md). More children create more edit
buttons, but every instance uses the same handler shape with that row's child id.

# Citations

* `src/components/design/ChildrenScreen.tsx`
