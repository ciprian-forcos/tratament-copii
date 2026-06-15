---
type: UI Button
title: Child Editor Stepper Plus Button
description: Template plus button for years, months, and weight steppers.
resource: src/components/design/ChildEditor.tsx
tags: [button, child-editor, stepper, template]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Child profile editor sheet](../child-profile-editor-sheet.md)

# Functionality

* [Child profile editing](../../functionality/child-profile-editing.md)

# Handler

`Stepper` clamps and calls `onChange(Math.min(max, value + step))`.

# Instances And Placement

The same plus button template appears in each stepper: years, months, and
kilograms. More numeric profile fields would reuse this template inside their
own stepper row.

# Citations

* `src/components/design/ChildEditor.tsx`
