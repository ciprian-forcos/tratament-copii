---
type: Process Artifact
title: Specs Corpus
description: Ingest summary for specs/ and its relationship to the narrower V1 graph.
resource: specs/
tags: [sources, specs, product, domain]
timestamp: 2026-06-15T21:30:00+03:00
---

# What It Contains

`specs/` describes the original broader app model:

* `app-overview.md` - tabbed app overview and local-storage persistence.
* `children-profiles.md` - child profiles, active child selection, weight/height fields, and medication enablement.
* `medications.md` - medication model, dose formulas, defaults, and custom medication editing.
* `no-duplicate-medications.md` - duplicate-name validation.
* `scheduling.md` - schedule rule variants and default intervals.

# Useful Stable Facts

The specs remain useful for the data model and older utilities:

* Child profiles carry weight, optional height, and enabled medications.
* Medication dose formulas include fixed, weight-divided, mg/kg, and weight-threshold shapes.
* Schedule rules support `every_n_hours`, `after_medication`, `once_per_day`, and `times_per_day`.
* Duplicate medication names should be rejected in medication editing flows.

# Scope Status

The specs are broader than [V1 scope](../product/v1-scope.md). They describe a
three-tab medicine-program app with custom medication editing, vitamins, and
cough-syrup style scheduling. The active V1 product is narrower: a fever panic
flow centered on the [3 AM use case](../product/3am-use-case.md).

# Known Drift

* `specs/scheduling.md` and `src/data/scheduleRules.ts` still list Panadol at `6h`.
* [Treatment plan rules](../medical/treatment-plan-rules.md) records the newer hardening target: Nurofen `8h`, Panadol `8h`, and `4h` cross-drug spacing.
* Specs describe the legacy tabs, while `src/App.tsx` routes to Design B through [Application source map](app-source-map.md).

# Citations

* `specs/app-overview.md`
* `specs/children-profiles.md`
* `specs/medications.md`
* `specs/no-duplicate-medications.md`
* `specs/scheduling.md`
