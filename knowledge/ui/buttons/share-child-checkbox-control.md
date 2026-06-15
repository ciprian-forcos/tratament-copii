---
type: UI Control
title: Share Child Checkbox Control
description: Repeated checkbox that includes or excludes one child from the generated share URL.
resource: src/components/design/share/ShareSheet.tsx
tags: [control, share, child-selection, template]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Share sheet](../share-sheet.md)

# Functionality

* [Share URL generation](../../functionality/share-url-generation.md)

# Handler

Calls `toggleChild(child.id)`.

# Instances And Placement

One checkbox row appears per saved child in [Share sheet](../share-sheet.md).
Rows stack vertically. When share-all is enabled, all child checkbox rows stay
visible but become disabled and visually muted.

# Citations

* `src/components/design/share/ShareSheet.tsx`
