---
type: Process Artifact
title: V1 Phase 06 Hardening
description: Next implementation phase mapped from QA bug nodes.
resource: Bug reports/List
tags: [process, phase, v1, hardening, bugs]
timestamp: 2026-06-15T22:00:00+03:00
---

# Branch

Use `V1/phase-06-hardening` for the next development loop.

# Scope

This phase fixes QA hardening bugs imported from [Phase 6 hardening bugs](phase6-hardening-bugs.md).

# Planning Files

* [V1 Phase 06 overview](../../.planning/phases/06-hardening/06-00-OVERVIEW.md)
* [06-01 treatment history and timing](../../.planning/phases/06-hardening/06-01-treatment-history-and-timing-PLAN.md)
* [06-02 home screen hardening](../../.planning/phases/06-hardening/06-02-home-screen-hardening-PLAN.md)
* [06-03 UI cleanup](../../.planning/phases/06-hardening/06-03-ui-cleanup-PLAN.md)
* [06-04 install and medicines](../../.planning/phases/06-hardening/06-04-install-and-medicines-PLAN.md)

# Execution

Use [Phase 06 fresh context execution](phase-06-fresh-context-execution.md) to
spawn one cold implementer per grouped plan and fresh reviewers per review
cycle. Use [Phase 06 parallel execution map](phase-06-parallel-execution-map.md)
to decide which lanes may run concurrently.

# Product Decision

Restore `MedicamenteTab` and ensure antipyretics are available there. Do not
build a new custom medicine editor for Phase 06.

# Knowledge Graph Requirement

Use [UI interaction graph](../ui/interaction-graph.md) during implementation.
When a plan changes a page or button, update the matching `UI Page`,
`UI Button` or `UI Control`, and `UI Functionality` nodes in the same change.

# Bug Queue

1. [Missing add-to-home-screen affordance](../bugs/missing-add-to-home-screen-affordance.md)
2. [Phantom countdown before treatment starts](../bugs/phantom-countdown-before-treatment.md)
3. [Timeline now marker anchoring](../bugs/timeline-now-marker-anchoring.md)
4. [Home controls and fake status icons](../bugs/home-controls-and-fake-status-icons.md)
5. [Temperature copy](../bugs/temperature-copy.md)
6. [Medicine add flow](../bugs/medicine-add-flow.md)
7. [Treatment timing policy mismatch](../bugs/treatment-timing-policy-mismatch.md)
8. [Children BSA display](../bugs/children-bsa-display.md)
9. [Step 2 title copy](../bugs/step2-title-copy.md)
10. [Step 2 real date/time entry](../bugs/step2-real-datetime-entry.md)
11. [Step 2 Virodep choice](../bugs/step2-virodep-choice.md)
12. [Unsupported emergency banner](../bugs/unsupported-emergency-banner.md)

# Suggested Order

Use the grouped implementation plans with parallel lanes:

1. treatment history and timing,
2. home screen hardening and UI cleanup in parallel when write sets are clear,
3. install affordance and restored medicines path.

# Citations

* `knowledge/process/phase6-hardening-bugs.md`
* `.planning/phases/06-hardening/06-00-OVERVIEW.md`
* `git show origin/harness/autonomous-v1-delivery:"Bug reports/List"`
