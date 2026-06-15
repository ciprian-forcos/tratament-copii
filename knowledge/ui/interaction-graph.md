---
type: UI Page
title: UI Interaction Graph
description: Index node linking specs, features, pages, functionality, buttons, controls, and source functions.
resource: knowledge/ui/
tags: [ui, graph, pages, buttons, controls]
timestamp: 2026-06-15T22:30:00+03:00
---

# Chain Rule

Use this chain for UI planning and implementation:

[Specs corpus](../sources/specs-corpus.md) and product nodes -> feature nodes ->
page/sheet nodes -> functionality nodes -> button/control nodes -> source
functions, stores, tests, and bug nodes.

# Features

* [Panic treatment flow](../features/panic-treatment-flow.md)
* [Child profile management](../features/child-profile-management.md)
* [Share by URL](../features/share-by-url.md)
* [Medicine management](../features/medicine-management.md)
* [PWA install affordance](../features/pwa-install-affordance.md)

# Pages And Sheets

* [Home screen](home-screen.md)
* [Step 1 temperature entry](step1-temperature-entry.md)
* [Step 2 treatment history](step2-treatment-history.md)
* [Plan card](plan-card.md)
* [Children screen](children-screen.md)
* [Child profile editor sheet](child-profile-editor-sheet.md)
* [Temperature picker sheet](temperature-picker-sheet.md)
* [Share sheet](share-sheet.md)
* [Import gate sheets](import-gate-sheets.md)
* [Medicines page](medicines-page.md)

# Functionality

* [Timeline and next dose display](../functionality/timeline-and-next-dose-display.md)
* [Temperature entry](../functionality/temperature-entry.md)
* [Treatment history entry](../functionality/treatment-history-entry.md)
* [Dose plan generation](../functionality/dose-plan-generation.md)
* [Dose recording](../functionality/dose-recording.md)
* [Child profile editing](../functionality/child-profile-editing.md)
* [Share URL generation](../functionality/share-url-generation.md)
* [Share URL import](../functionality/share-url-import.md)
* [Medicine editing](../functionality/medicine-editing.md)
* [PWA install entry](../functionality/pwa-install-entry.md)

# Current Caveat

This graph records both current source facts and Phase 06 planned changes. Nodes
mark planned-only buttons or behavior explicitly.

# Citations

* `src/components/design/FlowProtoB.tsx`
* `src/components/design/HomeB.tsx`
* `src/components/design/Step1.tsx`
* `src/components/design/Step2.tsx`
* `src/components/design/PlanCard.tsx`
* `src/components/design/ChildrenScreen.tsx`
* `src/components/design/share/ShareSheet.tsx`
* `src/components/design/share/ImportGate.tsx`
* `src/components/MedicamenteTab.tsx`
* `.planning/phases/06-hardening/*`
