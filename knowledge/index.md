# Tratament Febra Copii OKF Bundle

This directory is an Open Knowledge Format bundle for the project. It is meant
to be read by agents, reviewed in git, and opened as an Obsidian vault. The
Google OKF `viz.html` viewer is a generated snapshot and is not the maintained
graph surface.

# Project State

* [Current repository state](process/repo-branch-state.md) - branch topology and the source of truth for latest implementation.
* [V2 Phase 01 Program And Panic](process/v2-phase-01-program-and-panic.md) - current: 24h program + calm/night home.
* [V1 Phase 08 Treatment Flow](process/v1-phase-08-treatment-flow.md) - ongoing fever episode from Home.
* [V1 Phase 07 Home Next Dose](process/v1-phase-07-home-next-dose.md) - Home countdown from recorded history.
* [Phase 6 hardening bugs](process/phase6-hardening-bugs.md) - QA findings imported from the newer planning branch.
* [V1 Phase 06 Hardening](process/v1-phase-06-hardening.md) - completed hardening phase mapped from individual bug nodes.
* [Phase 06 fresh context execution](process/phase-06-fresh-context-execution.md) - subagent context and review map for Phase 06.
* [Phase 06 parallel execution map](process/phase-06-parallel-execution-map.md) - lane ownership and parallel subagent sequencing.
* [Autonomous harness](process/autonomous-harness.md) - current implementation loop and review gates.
* [Delivery loop evaluation](process/delivery-loop-evaluation.md) - whether the harness loop is still worth its overhead.
* [Delivery loop roles](process/delivery-loop-roles.md) - role map for the process loop.
* [Orchestrator role](process/orchestrator-role.md) - sequencing, spawning, state, and escalation.
* [Implementer role](process/implementer-role.md) - scoped implementation and evidence handoff.
* [Agent-Reviewer role](process/agent-reviewer-role.md) - mechanical verification.
* [Design-Reviewer role](process/design-reviewer-role.md) - judgment review.
* [Human Reviewer role](process/human-reviewer-role.md) - final acceptance and release authority.
* [Version and phase branch naming](process/version-phase-branch-naming.md) - convention for `Vx/phase-*` branches, planning folders, and graph notes.
* [Ponytail audit observations](process/ponytail-audit-observations.md) - repo-wide simplification targets from the first Ponytail audit.

# Source Ingest Graph

* [Repository source inventory](sources/repo-source-inventory.md) - repo-wide ingest scope and exclusions.
* [Planning corpus](sources/planning-corpus.md) - `.planning/` phase history, durable decisions, and stale constraints.
* [Specs corpus](sources/specs-corpus.md) - original domain specs and their status against V1.
* [Application source map](sources/app-source-map.md) - active app source, legacy retained source, stores, sharing, scheduling, and tests.
* [Tooling and deploy source map](sources/tooling-and-deploy.md) - package scripts, PWA config, deployment, and verification tooling.

# Bug Backlog

* [Missing add-to-home-screen affordance](bugs/missing-add-to-home-screen-affordance.md)
* [Phantom countdown before treatment starts](bugs/phantom-countdown-before-treatment.md)
* [Timeline now marker anchoring](bugs/timeline-now-marker-anchoring.md)
* [Home controls and fake status icons](bugs/home-controls-and-fake-status-icons.md)
* [Temperature copy](bugs/temperature-copy.md)
* [Medicine add flow](bugs/medicine-add-flow.md)
* [Treatment timing policy mismatch](bugs/treatment-timing-policy-mismatch.md)
* [Children BSA display](bugs/children-bsa-display.md)
* [Step 2 title copy](bugs/step2-title-copy.md)
* [Step 2 real date/time entry](bugs/step2-real-datetime-entry.md)
* [Step 2 Virodep choice](bugs/step2-virodep-choice.md)
* [Unsupported emergency banner](bugs/unsupported-emergency-banner.md)

# Product

* [3 AM use case](product/3am-use-case.md) - the core product reason for the app.
* [V1 scope](product/v1-scope.md) - what V1 must and must not contain.

# Medical And Safety Knowledge

* [Treatment plan rules](medical/treatment-plan-rules.md) - project timing policy and source status.
* [Dosage versus treatment plan](medical/dosage-vs-treatment-plan.md) - terminology boundary used by code and copy.
* [Medical source ledger](references/medical-sources.md) - external medical references and caveats.

# UI Graph

* [UI interaction graph](ui/interaction-graph.md) - spec -> feature -> page -> functionality -> button/control -> code traceability.
* [Home screen](ui/home-screen.md) - countdown, clock, timeline, child and temperature controls.
* [Step 1 temperature entry](ui/step1-temperature-entry.md) - panic-flow temperature page.
* [Step 2 treatment history](ui/step2-treatment-history.md) - last-treatment medication and datetime entry.
* [Plan card](ui/plan-card.md) - generated action card and dose recording.
* [Children screen](ui/children-screen.md) - child profiles, active child, BSA issue, sharing entry.
* [Child profile editor sheet](ui/child-profile-editor-sheet.md) - child profile add/edit/remove sheet.
* [Temperature picker sheet](ui/temperature-picker-sheet.md) - home temperature wheel sheet.
* [Share sheet](ui/share-sheet.md) - URL export/import mental model.
* [Import gate sheets](ui/import-gate-sheets.md) - share URL import confirm/error sheets.
* [Medicines page](ui/medicines-page.md) - restored `MedicamenteTab` page.
* [Program screen](ui/program-screen.md) - 24h treatment schedule and rules.

# Feature Graph

* [Panic treatment flow](features/panic-treatment-flow.md)
* [Child profile management](features/child-profile-management.md)
* [Share by URL](features/share-by-url.md)
* [Medicine management](features/medicine-management.md)
* [PWA install affordance](features/pwa-install-affordance.md)

# Functionality Graph

* [Timeline and next dose display](functionality/timeline-and-next-dose-display.md)
* [Temperature entry](functionality/temperature-entry.md)
* [Treatment history entry](functionality/treatment-history-entry.md)
* [Dose plan generation](functionality/dose-plan-generation.md)
* [Dose recording](functionality/dose-recording.md)
* [Child profile editing](functionality/child-profile-editing.md)
* [Share URL generation](functionality/share-url-generation.md)
* [Share URL import](functionality/share-url-import.md)
* [Medicine editing](functionality/medicine-editing.md)
* [PWA install entry](functionality/pwa-install-entry.md)

# Button And Control Nodes

* [Home child pill button](ui/buttons/home-child-pill-button.md)
* [Home profile button](ui/buttons/home-profile-button.md)
* [Home menu button](ui/buttons/home-menu-button.md)
* [Home temperature button](ui/buttons/home-temperature-button.md)
* [Home start treatment button](ui/buttons/home-start-treatment-button.md)
* [Home install button](ui/buttons/home-install-button.md)
* [Step shell back button](ui/buttons/step-shell-back-button.md)
* [Step shell primary CTA button](ui/buttons/step-shell-primary-cta-button.md)
* [Step 1 temperature minus button](ui/buttons/step1-temperature-minus-button.md)
* [Step 1 temperature plus button](ui/buttons/step1-temperature-plus-button.md)
* [Step 1 temperature preset button](ui/buttons/step1-temperature-preset-button.md)
* [Step 2 first treatment button](ui/buttons/step2-first-treatment-button.md)
* [Step 2 last dose button](ui/buttons/step2-last-dose-button.md)
* [Step 2 medication choice button](ui/buttons/step2-medication-choice-button.md)
* [Step 2 datetime input control](ui/buttons/step2-time-choice-button.md)
* [Plan back button](ui/buttons/plan-back-button.md)
* [Plan record dose button](ui/buttons/plan-record-dose-button.md)
* [Plan wait button](ui/buttons/plan-wait-button.md)
* [Plan change something button](ui/buttons/plan-change-something-button.md)
* [Children share button](ui/buttons/children-share-button.md)
* [Children edit child button](ui/buttons/children-edit-child-button.md)
* [Children set active button](ui/buttons/children-set-active-button.md)
* [Children add child button](ui/buttons/children-add-child-button.md)
* [Children back button](ui/buttons/children-back-button.md)
* [Children medicines button](ui/buttons/children-medicines-button.md)
* [Child editor close button](ui/buttons/child-editor-close-button.md)
* [Child editor saved child button](ui/buttons/child-editor-saved-child-button.md)
* [Child editor add child button](ui/buttons/child-editor-add-child-button.md)
* [Child editor stepper minus button](ui/buttons/child-editor-stepper-minus-button.md)
* [Child editor stepper plus button](ui/buttons/child-editor-stepper-plus-button.md)
* [Child editor delete profile button](ui/buttons/child-editor-delete-profile-button.md)
* [Child editor done button](ui/buttons/child-editor-done-button.md)
* [Temperature wheel cancel button](ui/buttons/temp-wheel-cancel-button.md)
* [Temperature wheel save button](ui/buttons/temp-wheel-save-button.md)
* [Temperature wheel value control](ui/buttons/temp-wheel-value-control.md)
* [Share close button](ui/buttons/share-close-button.md)
* [Share child checkbox control](ui/buttons/share-child-checkbox-control.md)
* [Share all checkbox control](ui/buttons/share-all-checkbox-control.md)
* [Share generate link button](ui/buttons/share-generate-link-button.md)
* [Share copy button](ui/buttons/share-copy-button.md)
* [Share native share button](ui/buttons/share-native-share-button.md)
* [Share cancel button](ui/buttons/share-cancel-button.md)
* [Import sheet close button](ui/buttons/import-sheet-close-button.md)
* [Import sheet cancel button](ui/buttons/import-sheet-cancel-button.md)
* [Import sheet import button](ui/buttons/import-sheet-import-button.md)
* [Import error close button](ui/buttons/import-error-close-button.md)
* [Medicines add button](ui/buttons/medicines-add-button.md)
* [Medicines edit button](ui/buttons/medicines-edit-button.md)
* [Medicines delete button](ui/buttons/medicines-delete-button.md)
* [Medicines delete confirm button](ui/buttons/medicines-delete-confirm-button.md)
* [Medicines delete cancel button](ui/buttons/medicines-delete-cancel-button.md)
* [Medicines add threshold button](ui/buttons/medicines-add-threshold-button.md)
* [Medicines remove threshold button](ui/buttons/medicines-remove-threshold-button.md)
* [Medicines color swatch button](ui/buttons/medicines-color-swatch-button.md)
* [Medicines dialog cancel button](ui/buttons/medicines-dialog-cancel-button.md)
* [Medicines dialog save button](ui/buttons/medicines-dialog-save-button.md)

# Implementation Graph

* [Local storage and app state](implementation/app-state-local-storage.md) - persistence keys and upgrade safety.
* [Dose history store](implementation/dose-history-store.md) - administered dose persistence.
* [Schedule adapter and treatment plan](implementation/schedule-adapter-and-dose-plan.md) - timing path from rules to UI, including Home next-dose via `nextPlannedDose`.
* [Share URL import and merge](implementation/share-url-import-merge.md) - Tier 1 sharing implementation.

# External Methods

* [Open Knowledge Format](references/open-knowledge-format.md) - why this bundle is structured this way.
* [Karpathy LLM Wiki pattern](references/karpathy-llm-wiki.md) - raw sources, compiled wiki, schema, operations.
* [Ponytail simplification discipline](references/ponytail.md) - how to keep future implementation smaller.
* [Knowledge schema](AGENTS.md) - local writing rules for this OKF / Obsidian vault.
