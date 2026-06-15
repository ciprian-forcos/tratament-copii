---
type: UI Button
title: Import Sheet Import Button
description: Applies the incoming shared payload after confirmation.
resource: src/components/design/share/ImportGate.tsx
tags: [button, import, merge]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Import gate sheets](../import-gate-sheets.md)

# Functionality

* [Share URL import](../../functionality/share-url-import.md)

# Handler

Calls `handleImport`, which merges children and optional medicines, writes
state, cleans the URL, and dismisses the sheet.

# Citations

* `src/components/design/share/ImportGate.tsx`
* `src/components/design/share/merge.ts`
