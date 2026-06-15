---
type: Implementation Module
title: Local Storage And App State
description: Persistent browser state is local-first and must preserve existing storage keys across upgrades.
resource: src/components/design/childStore.ts
tags: [implementation, local-storage, state, data-safety]
timestamp: 2026-06-15T19:00:00+03:00
---

# Protected Keys

The product documentation marks these keys as protected:

* `tratament-copii-children`
* `tratament-copii-active-child`
* `tratament-copii-medications`

Dose history uses an additive key:

* `tratament-copii-administered-doses`

# Data Safety Rule

Any future migration must be additive or backward-compatible. Returning users
must not lose child, active-child, medication, or dose-history data.

# Medicine State

Phase 06 Lane D centralizes medicine reads/writes in
`src/components/design/medicineStorage.ts`. `tratament-copii-medications` is the
single key for restored medicine edits, share export, and import merge. When the
key is absent or invalid, the app reads `DEFAULT_MEDICATIONS`; imports merge
incoming medicines with that local/default list before saving. Import merge emits
`tratament-copii-medications-changed` so the active Design B route can reload
medicine state without a page refresh.

# Connected Concepts

* [V1 scope](../product/v1-scope.md)
* [Dose history store](dose-history-store.md)
* [Share URL import and merge](share-url-import-merge.md)

# Citations

* `.planning/BRIEF.md`
* `.planning/V1_ACCEPTANCE.md`
* `src/components/design/childStore.ts`
* `src/components/design/doseStore.ts`
* `src/components/design/medicineStorage.ts`
