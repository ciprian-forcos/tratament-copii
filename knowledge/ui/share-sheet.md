---
type: UI Element
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
* [Children screen](children-screen.md)

# Citations

* `src/components/design/share/ShareSheet.tsx`
* `src/components/design/share/ImportGate.tsx`
* `src/components/design/share/encoder.ts`
* `src/components/design/share/merge.ts`
