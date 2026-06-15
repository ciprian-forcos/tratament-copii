---
type: Implementation Module
title: Share URL Import And Merge
description: Tier 1 sharing serializes child and medication state into a URL and merges it after confirmation.
resource: src/components/design/share/encoder.ts
tags: [implementation, sharing, import, merge, privacy]
timestamp: 2026-06-15T19:00:00+03:00
---

# Responsibility

Sharing is local and backend-free. It uses URL payloads, a confirmation gate,
and merge logic rather than accounts or cloud sync.

# Files

* `src/components/design/share/encoder.ts`
* `src/components/design/share/merge.ts`
* `src/components/design/share/ShareSheet.tsx`
* `src/components/design/share/ImportGate.tsx`

# Data Rules

* Temporary temperature is stripped from shared payloads.
* Existing local state is merged, not replaced blindly.
* Import query parameters are cleaned after import, cancel, or error.

# Connected Concepts

* [Share sheet](../ui/share-sheet.md)
* [Local storage and app state](app-state-local-storage.md)
* [V1 scope](../product/v1-scope.md)

# Citations

* `src/components/design/share/encoder.ts`
* `src/components/design/share/merge.ts`
* `src/components/design/share/ImportGate.tsx`
* `src/components/design/share/*.test.ts`
