---
type: UI Page
title: Step 2 Treatment History
description: The panic-flow step where a parent says whether and when antipyretic treatment was already administered.
resource: src/components/design/Step2.tsx
tags: [ui, panic-flow, treatment-history, datetime, medication]
timestamp: 2026-06-15T23:10:00+03:00
---

# User Job

The parent must be able to say either:

* this is the first treatment, or
* a previous antipyretic was administered at a specific date and time.

# Current Implementation

The active implementation is `src/components/design/Step2.tsx`.

Implemented behavior:

* The step title is `Ai mai administrat altceva?`.
* First-treatment mode records that no prior antipyretic dose exists.
* Previous-dose mode asks which timed antipyretic was used and when it was administered.
* Previous-dose medication choices are Nurofen and Panadol only.
* Previous-dose timing is captured with a native `datetime-local` input bound to `lastAt`.
* Virodep and Novocalmin are not shown as previous-dose choices.

# Desired Knowledge Links

This node should always link to:

* [Panic treatment flow](../features/panic-treatment-flow.md)
* [Treatment history entry](../functionality/treatment-history-entry.md)
* [Dose plan generation](../functionality/dose-plan-generation.md)
* [Treatment plan rules](../medical/treatment-plan-rules.md)
* [Schedule adapter and treatment plan](../implementation/schedule-adapter-and-dose-plan.md)
* [Plan card](plan-card.md)

# Buttons

* [Step shell back button](buttons/step-shell-back-button.md)
* [Step 2 first treatment button](buttons/step2-first-treatment-button.md)
* [Step 2 last dose button](buttons/step2-last-dose-button.md)
* [Step 2 medication choice button](buttons/step2-medication-choice-button.md)
* [Step 2 datetime input control](buttons/step2-time-choice-button.md)
* [Step shell primary CTA button](buttons/step-shell-primary-cta-button.md)

# Repeated Instances

Medication choices render as a two-column grid under the previous-dose path.
There are no per-time repeated button instances for previous-dose timing.
The old repeated time-choice button node is retained only as a control/template
node for the single native date/time input.

# Source Functions

* `Step2`
* `StepShell`
* `onChange`
* `onNext`

# Ponytail Constraint

Native date/time entry is the intended simple control; do not add a custom time
wheel unless target-phone testing proves the native control insufficient. See
[Ponytail simplification discipline](../references/ponytail.md).

# Citations

* `src/components/design/Step2.tsx`
* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
