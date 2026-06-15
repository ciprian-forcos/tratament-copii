---
type: UI Button
title: Child Editor Delete Profile Button
description: Deletes the active child profile when more than one child exists.
resource: src/components/design/ChildEditor.tsx
tags: [button, child-editor, delete-child]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Child profile editor sheet](../child-profile-editor-sheet.md)

# Functionality

* [Child profile editing](../../functionality/child-profile-editing.md)

# Handler

Calls `childStore.remove(active.id)`; disabled when only one child remains.

# Citations

* `src/components/design/ChildEditor.tsx`
