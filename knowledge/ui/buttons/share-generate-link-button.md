---
type: UI Button
title: Share Generate Link Button
description: Generates the URL for the selected share payload.
resource: src/components/design/share/ShareSheet.tsx
tags: [button, share, url-generation]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Share sheet](../share-sheet.md)

# Functionality

* [Share URL generation](../../functionality/share-url-generation.md)

# Handler

Calls `handleGenerate`, which builds a `SharePayload` and calls `buildShareUrl`.

# Citations

* `src/components/design/share/ShareSheet.tsx`
* `src/components/design/share/encoder.ts`
