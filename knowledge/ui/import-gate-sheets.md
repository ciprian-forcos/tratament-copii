---
type: UI Page
title: Import Gate Sheets
description: Import confirmation and invalid-link sheets shown when a share URL is opened.
resource: src/components/design/share/ImportGate.tsx
tags: [ui, sheet, import, share]
timestamp: 2026-06-15T22:30:00+03:00
---

# User Job

Review incoming shared state before merging it, or dismiss an invalid link
without changing local state.

# Feature And Functionality

* [Share by URL](../features/share-by-url.md)
* [Share URL import](../functionality/share-url-import.md)

# Buttons

* [Import sheet close button](buttons/import-sheet-close-button.md)
* [Import sheet cancel button](buttons/import-sheet-cancel-button.md)
* [Import sheet import button](buttons/import-sheet-import-button.md)
* [Import error close button](buttons/import-error-close-button.md)

# Source Functions

* `ImportGate`
* `ConfirmSheet`
* `ErrorSheet`
* `handleImport`
* `handleCancel`
* `handleClose`
* `cleanUrl`

# Citations

* `src/components/design/share/ImportGate.tsx`
* `src/components/design/share/merge.ts`
