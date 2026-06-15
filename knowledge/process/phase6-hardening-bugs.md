---
type: Process Artifact
title: Phase 6 Hardening Bugs
description: QA bug list for V1 hardening, sourced from the newer harness planning branch rather than main.
resource: Bug reports/List
tags: [process, qa, bugs, hardening, phase-6]
timestamp: 2026-06-15T19:00:00+03:00
---

# Provenance

This bug list exists on `origin/harness/autonomous-v1-delivery` and not on
latest implementation branch `main`. Treat it as a hardening input, not as proof
that the harness branch has newer app code.

# Bug Map

1. Missing add-to-home-screen affordance.
2. Phantom countdown before treatment starts.
3. Timeline "now" marker appears at the far right; expected middle anchoring.
4. Temperature, age, and child controls need to be separate; fake status icons should disappear.
5. "Masoara din nou" should become "Temperatura".
6. No possibility to add medicines.
7. Treatment timing: Nurofen / ibuprofen and Panadol / paracetamol spacing must follow [Treatment plan rules](../medical/treatment-plan-rules.md).
8. BSA display in children menu is not needed.
9. Step 2 title should be "Ai mai administrat altceva?"
10. Step 2 needs real date/time entry because treatment may have started days ago.
11. Virodep is not antipyretic and should not appear in last-dose choices.
12. 112 / pediatrician banner should be removed.

# Connected UI Nodes

* [Home screen](../ui/home-screen.md)
* [Step 2 treatment history](../ui/step2-treatment-history.md)
* [Plan card](../ui/plan-card.md)
* [Children screen](../ui/children-screen.md)

# Citations

* `git show origin/harness/autonomous-v1-delivery:"Bug reports/List"`
* `.planning/phases/06-hardening/*` on `origin/harness/autonomous-v1-delivery`
