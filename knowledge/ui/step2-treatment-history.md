---
type: UI Page
title: Step 2 Treatment History
description: The panic-flow step where a parent says whether and when antipyretic treatment was already administered.
resource: src/components/design/Step2.tsx
tags: [ui, panic-flow, treatment-history, datetime, medication]
timestamp: 2026-06-15T19:00:00+03:00
---

# User Job

The parent must be able to say either:

* this is the first treatment, or
* a previous antipyretic was administered at a specific date and time.

# Current Implementation

The active implementation is `src/components/design/Step2.tsx`.

Known issues:

* Title is "Ai mai dat ceva?"; QA wants "Ai mai administrat altceva?"
* Virodep is offered even though [Treatment plan rules](../medical/treatment-plan-rules.md) say it is not an antipyretic.
* Time choices are fixed to a few same-night values plus `alt...`.
* There is no working multi-day date/time entry, even though treatment may have started days ago.

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
* [Step 2 time choice button](buttons/step2-time-choice-button.md)
* [Step shell primary CTA button](buttons/step-shell-primary-cta-button.md)

# Repeated Instances

Medication choices render as a two-column grid under the previous-dose path.
Current time chips render as a four-column grid under the medication choices.
Phase 06 should replace the time-chip template with real date/time entry, so
the repeated-time behavior is a current bug, not a target pattern.

# Source Functions

* `Step2`
* `StepShell`
* `onChange`
* `onNext`

# Ponytail Constraint

Before adding a custom time wheel, test whether native date/time inputs can do
the job on the target phones. See [Ponytail simplification discipline](../references/ponytail.md).

# Citations

* `src/components/design/Step2.tsx`
* [Phase 6 hardening bugs](../process/phase6-hardening-bugs.md)
