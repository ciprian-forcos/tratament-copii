---
type: UI Functionality
title: Treatment History Entry
description: Captures whether this is first treatment or a previous antipyretic dose exists.
resource: src/components/design/Step2.tsx
tags: [functionality, treatment-history, timing]
timestamp: 2026-06-15T23:10:00+03:00
---

# Page

* [Step 2 treatment history](../ui/step2-treatment-history.md)

# Buttons And Controls

* [Step 2 first treatment button](../ui/buttons/step2-first-treatment-button.md)
* [Step 2 last dose button](../ui/buttons/step2-last-dose-button.md)
* [Step 2 medication choice button](../ui/buttons/step2-medication-choice-button.md)
* [Step 2 datetime input control](../ui/buttons/step2-time-choice-button.md)

# Source Functions

* `Step2`
* `set`
* `onChange`

# Current Behavior

* Step 2 is titled `Ai mai administrat altceva?`.
* First-treatment mode records no previous dose.
* Previous-dose mode offers only timed antipyretics: Nurofen and Panadol.
* Previous-dose timing is stored through the native `datetime-local` `lastAt` field.
* Virodep and Novocalmin are not previous-dose options.

# Citations

* `src/components/design/Step2.tsx`
* [Treatment plan rules](../medical/treatment-plan-rules.md)
