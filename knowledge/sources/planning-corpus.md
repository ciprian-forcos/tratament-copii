---
type: Process Artifact
title: Planning Corpus
description: Ingest summary for .planning, including phase history, useful decisions, and stale constraints.
resource: .planning/
tags: [sources, planning, phases, process, historical]
timestamp: 2026-06-15T21:30:00+03:00
---

# What It Contains

`.planning/` is the historical delivery corpus for V1. It includes the brief,
roadmap, process rules, acceptance criteria, QA handoff, agent prompts, and
phase plans/summaries.

The key phase map is:

* `00-baseline` - Design B baseline and Vitest/RTL setup.
* `01-dose-records` - administered-dose persistence.
* `02-night-timeline` - real dose history on the home timeline.
* `03-schedule-engine` - adapter from dose history to schedule engine.
* `04-children-screen` - child profile management.
* `05-share-tier1` - URL share encode, share UI, and import/merge.

# Stable Decisions To Keep

* The product is anchored on the [3 AM use case](../product/3am-use-case.md).
* [V1 scope](../product/v1-scope.md) is local-first: child profiles, panic flow, dose history, night timeline, schedule-based next dose, and Tier 1 URL sharing.
* [Local storage and app state](../implementation/app-state-local-storage.md) treats child, active-child, medication, and dose-history keys as data-safety contracts.
* [Schedule adapter and treatment plan](../implementation/schedule-adapter-and-dose-plan.md) intentionally keeps alternation policy in `dosePlan.ts` and lets the generic engine handle per-medication repeat intervals.
* The harness valued literal gate output, remote SHA checks, and explicit reviewer loops.

# Stale Or Superseded Decisions

* `.planning/PROCESS.md` uses `phase-{NN}/{plan-id}-{short-name}` branches and explicitly says branches are not version named. This is superseded by [Version and phase branch naming](../process/version-phase-branch-naming.md), which uses `V<version>/phase-<nn>-<slug>`.
* `.planning/ROADMAP.md` has stale progress state compared with `.planning/DELIVERY_STATE.md` and `.planning/QA_HANDOFF.md`.
* `.planning/DELIVERY_STATE.md` says V1 was feature-complete on `origin/v1-delivery`; [Current repository branch state](../process/repo-branch-state.md) says `main` is now the implementation source of truth.
* Planning and specs preserve the older `2h` cross-drug floor and Panadol `6h` repeat interval; [Treatment plan rules](../medical/treatment-plan-rules.md) records the later hardening target of Nurofen `8h`, Panadol `8h`, and `4h` cross-drug spacing.
* The old harness forbids deleting legacy tabs in V1; [Ponytail audit observations](../process/ponytail-audit-observations.md) now treats those tabs as a simplification candidate. That should be resolved by an explicit phase plan, not by inertia.
* Role boundaries are now separated in [Delivery loop roles](../process/delivery-loop-roles.md); this avoids hiding the orchestrator, implementer, reviewer, and human responsibilities inside one broad process summary.

# Practical Rule

Treat `.planning/` as evidence, not automatic policy. If it conflicts with
current code, human QA rules, or the current graph, record the conflict and
prefer the current graph decision.

# Citations

* `.planning/BRIEF.md`
* `.planning/PROCESS.md`
* `.planning/DELIVERY_STATE.md`
* `.planning/QA_HANDOFF.md`
* `.planning/ROADMAP.md`
* `.planning/V1_ACCEPTANCE.md`
* `.planning/phases/*`
* `.planning/prompts/*`
* `.planning/handoffs/HANDOFF_TEMPLATE.md`
