---
type: UI Button
title: Child Editor Saved Child Button
description: Repeated saved-child chip that switches the active child.
resource: src/components/design/ChildEditor.tsx
tags: [button, child-editor, active-child, template]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Child profile editor sheet](../child-profile-editor-sheet.md)

# Functionality

* [Child profile editing](../../functionality/child-profile-editing.md)

# Handler

Calls `childStore.setActive(c.id)`.

# Instances And Placement

One chip appears per saved child in the horizontal scrolling row near the top of
[Child profile editor sheet](../child-profile-editor-sheet.md). With many
children, the row scrolls sideways instead of wrapping.

# Citations

* `src/components/design/ChildEditor.tsx`
