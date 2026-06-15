# Tratament Febra Copii OKF Bundle

This directory is an Open Knowledge Format bundle for the project. It is meant
to be read by agents, reviewed in git, and opened as an Obsidian vault. The
Google OKF `viz.html` viewer is a generated snapshot and is not the maintained
graph surface.

# Project State

* [Current repository state](process/repo-branch-state.md) - branch topology and the source of truth for latest implementation.
* [Phase 6 hardening bugs](process/phase6-hardening-bugs.md) - QA findings imported from the newer planning branch.
* [Autonomous harness](process/autonomous-harness.md) - current implementation loop and review gates.
* [Version and phase branch naming](process/version-phase-branch-naming.md) - convention for `Vx/phase-*` branches, planning folders, and graph notes.
* [Ponytail audit observations](process/ponytail-audit-observations.md) - repo-wide simplification targets from the first Ponytail audit.

# Product

* [3 AM use case](product/3am-use-case.md) - the core product reason for the app.
* [V1 scope](product/v1-scope.md) - what V1 must and must not contain.

# Medical And Safety Knowledge

* [Treatment plan rules](medical/treatment-plan-rules.md) - project timing policy and source status.
* [Dosage versus treatment plan](medical/dosage-vs-treatment-plan.md) - terminology boundary used by code and copy.
* [Medical source ledger](references/medical-sources.md) - external medical references and caveats.

# UI Graph

* [Home screen](ui/home-screen.md) - countdown, clock, timeline, child and temperature controls.
* [Step 2 treatment history](ui/step2-treatment-history.md) - last-treatment medication and datetime entry.
* [Plan card](ui/plan-card.md) - generated action card and dose recording.
* [Children screen](ui/children-screen.md) - child profiles, active child, BSA issue, sharing entry.
* [Share sheet](ui/share-sheet.md) - URL export/import mental model.

# Implementation Graph

* [Local storage and app state](implementation/app-state-local-storage.md) - persistence keys and upgrade safety.
* [Dose history store](implementation/dose-history-store.md) - administered dose persistence.
* [Schedule adapter and treatment plan](implementation/schedule-adapter-and-dose-plan.md) - timing path from rules to UI.
* [Share URL import and merge](implementation/share-url-import-merge.md) - Tier 1 sharing implementation.

# External Methods

* [Open Knowledge Format](references/open-knowledge-format.md) - why this bundle is structured this way.
* [Karpathy LLM Wiki pattern](references/karpathy-llm-wiki.md) - raw sources, compiled wiki, schema, operations.
* [Ponytail simplification discipline](references/ponytail.md) - how to keep future implementation smaller.
* [Knowledge schema](AGENTS.md) - local writing rules for this OKF / Obsidian vault.
