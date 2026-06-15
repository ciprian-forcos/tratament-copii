---
type: UI Page
title: Share Sheet
description: The Tier 1 sharing UI that exports local state into a URL and imports it through a confirmation gate.
resource: src/components/design/share/ShareSheet.tsx
tags: [ui, share, import, url, privacy]
timestamp: 2026-06-15T19:00:00+03:00
---

# User Job

One parent can send either one child or the full application state to another
parent. The second device opens a link, reviews a merge prompt, and imports.

# Current Implementation

The share UI lives in `src/components/design/share/ShareSheet.tsx`; import is
mounted through `src/components/design/share/ImportGate.tsx`.

# Privacy Rule

The share encoder strips temporary temperature values. This is a product and
privacy decision linked to [Local storage and app state](../implementation/app-state-local-storage.md).

# Connected Implementation

* [Share URL import and merge](../implementation/share-url-import-merge.md)
* [Share by URL](../features/share-by-url.md)
* [Share URL generation](../functionality/share-url-generation.md)
* [Children screen](children-screen.md)

# Buttons And Controls

* [Share close button](buttons/share-close-button.md)
* [Share child checkbox control](buttons/share-child-checkbox-control.md)
* [Share all checkbox control](buttons/share-all-checkbox-control.md)
* [Share generate link button](buttons/share-generate-link-button.md)
* [Share copy button](buttons/share-copy-button.md)
* [Share native share button](buttons/share-native-share-button.md)
* [Share cancel button](buttons/share-cancel-button.md)

# Repeated Instances

One [child checkbox](buttons/share-child-checkbox-control.md) appears per saved
child in a vertical list. When [share all](buttons/share-all-checkbox-control.md)
is enabled, those per-child checkboxes remain visible but disabled and muted.
The bottom sheet scrolls internally when the child list plus generated-link area
exceeds the available height.

# Source Functions

* `ShareSheet`
* `toggleChild`
* `toggleShareAll`
* `handleGenerate`
* `handleCopy`
* `handleNativeShare`
* `handleClose`

# Citations

* `src/components/design/share/ShareSheet.tsx`
* `src/components/design/share/ImportGate.tsx`
* `src/components/design/share/encoder.ts`
* `src/components/design/share/merge.ts`
