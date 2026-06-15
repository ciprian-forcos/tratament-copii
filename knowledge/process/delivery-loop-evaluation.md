---
type: Process Artifact
title: Delivery Loop Evaluation
description: Evaluation of the project implementation loop after ingesting planning, source, specs, and Ponytail observations.
resource: .planning/PROCESS.md
tags: [process, loop, evaluation, ponytail, harness]
timestamp: 2026-06-15T21:30:00+03:00
---

# Effectiveness

The old harness was effective for a high-risk V1 push. It forced small plans,
tests, build gates, SHA verification, and explicit handoffs. The result is a
working Design B implementation with child profiles, administered-dose storage,
schedule integration, URL sharing, and QA notes.

# Cost

The overhead is now visible:

* Branch, prompt, reviewer, and handoff rules are heavier than the current repo size needs.
* `.planning/` accumulated stale policy, especially branch naming and legacy-tab constraints.
* Some planning claims conflict with newer hardening knowledge, so future agents must spend time sorting truth layers.
* The loop optimizes for autonomous delivery safety, not for fast local maintenance.

# Practical Verdict

Use a lighter loop by default:

1. Create a `V<version>/phase-<nn>-<slug>` branch.
2. Write or update one short plan only for behavior-changing work.
3. Implement the smallest working change.
4. Run `npm run type-check`, `npm run test`, and `npm run build`.
5. Update the knowledge graph for changed product, medical, UI, implementation, or process facts.
6. Use human/design review only for UX, medical assumptions, data safety, or release decisions.

The heavy-loop roles are split in [Delivery loop roles](delivery-loop-roles.md)
so future notes can update one role without rewriting the whole process page.

# When To Use The Heavy Harness

Keep the old implementer/reviewer machinery for changes that combine multiple
risky properties: medical timing, persisted data migrations, share format
changes, release/deploy work, or broad multi-file refactors.

# Connected Concepts

* [Planning corpus](../sources/planning-corpus.md)
* [Repository source inventory](../sources/repo-source-inventory.md)
* [Ponytail audit observations](ponytail-audit-observations.md)
* [Version and phase branch naming](version-phase-branch-naming.md)
* [Autonomous harness](autonomous-harness.md)
* [Delivery loop roles](delivery-loop-roles.md)

# Citations

* `.planning/PROCESS.md`
* `.planning/DELIVERY_STATE.md`
* `.planning/V1_ACCEPTANCE.md`
* `scripts/verify-plan.sh`
* `knowledge/process/ponytail-audit-observations.md`
