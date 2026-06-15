---
type: Feature
title: Share By URL
description: Tier 1 state sharing by generated URL and import confirmation.
resource: src/components/design/share/
tags: [feature, share, import, url, privacy]
timestamp: 2026-06-15T22:30:00+03:00
---

# Purpose

Lets one parent send one child or the whole local app state to another device
without backend sync.

# Source Spec

* [V1 scope](../product/v1-scope.md)
* [Specs corpus](../sources/specs-corpus.md)

# Pages

* [Children screen](../ui/children-screen.md)
* [Share sheet](../ui/share-sheet.md)
* [Import gate sheets](../ui/import-gate-sheets.md)

# Functionality

* [Share URL generation](../functionality/share-url-generation.md)
* [Share URL import](../functionality/share-url-import.md)

# Source Functions

* `ShareSheet`
* `handleGenerate`
* `handleCopy`
* `handleNativeShare`
* `ImportGate`
* `handleImport`
* `decodeShare`
* `mergeChildren`
* `mergeMedications`

# Citations

* [Share URL import and merge](../implementation/share-url-import-merge.md)
* `.planning/BRIEF.md`
* `src/components/design/share/ShareSheet.tsx`
* `src/components/design/share/ImportGate.tsx`
