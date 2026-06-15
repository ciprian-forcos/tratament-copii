---
type: UI Page
title: Child Profile Editor Sheet
description: Bottom sheet for selecting, adding, editing, and deleting child profiles.
resource: src/components/design/ChildEditor.tsx
tags: [ui, sheet, children, profile-editing]
timestamp: 2026-06-15T22:30:00+03:00
---

# User Job

Edit the active child's name, age, and weight, switch between saved children, or
add/remove a child profile.

# Feature And Functionality

* [Child profile management](../features/child-profile-management.md)
* [Child profile editing](../functionality/child-profile-editing.md)

# Buttons

* [Child editor close button](buttons/child-editor-close-button.md)
* [Child editor saved child button](buttons/child-editor-saved-child-button.md)
* [Child editor add child button](buttons/child-editor-add-child-button.md)
* [Child editor stepper minus button](buttons/child-editor-stepper-minus-button.md)
* [Child editor stepper plus button](buttons/child-editor-stepper-plus-button.md)
* [Child editor delete profile button](buttons/child-editor-delete-profile-button.md)
* [Child editor done button](buttons/child-editor-done-button.md)

# Repeated Instances

Saved child chips appear in a horizontal scrolling row near the top of the
sheet; one [saved child button](buttons/child-editor-saved-child-button.md)
exists per child. The age and weight steppers reuse the same minus/plus button
templates for years, months, and kilograms. If the sheet grows tall, its inner
panel scrolls up to 90% viewport height.

# Source Functions

* `ChildEditor`
* `Stepper`
* `childStore.add`
* `childStore.patchActive`
* `childStore.setActive`
* `childStore.remove`

# Citations

* `src/components/design/ChildEditor.tsx`
* `src/components/design/childStore.ts`
