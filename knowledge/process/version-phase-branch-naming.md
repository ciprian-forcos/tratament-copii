---
type: Process Artifact
title: Version And Phase Branch Naming
description: Naming convention for versioned delivery branches, phase branches, planning folders, and graph notes.
resource: git
tags: [process, git, branches, versioning, phases, naming]
timestamp: 2026-06-15T21:00:00+03:00
---

# Branch Convention

Use a version prefix and phase segment for delivery work:

* Version branch root: `V<version>`
* Phase branch: `V<version>/phase-<nn>-<slug>`
* Optional task branch under a phase: `V<version>/phase-<nn>-<slug>/<task-slug>`

Examples:

* `V1/phase-06-hardening`
* `V1/phase-06-hardening/step2-datetime`
* `V1/phase-06-hardening/remove-unsupported-banner`

# Planning Convention

Planning folders should keep the same phase number and slug:

* `.planning/phases/<nn>-<slug>/`
* plan files: `<nn>-<unit>-PLAN.md`
* summary files: `<nn>-<unit>-SUMMARY.md`

Example:

* branch: `V1/phase-06-hardening`
* folder: `.planning/phases/06-hardening/`
* plan: `.planning/phases/06-hardening/06-01-PLAN.md`

# Knowledge Graph Convention

Each phase that changes behavior should have or update a process node in this
vault. Use stable lower-case filenames even when branch names use uppercase
`V`:

* phase node: `knowledge/process/phase<nn>-<slug>.md`
* cross-cutting convention node: `knowledge/process/version-phase-branch-naming.md`
* audit nodes: `knowledge/process/<method>-observations.md`

# Current Repository Note

[Current repository branch state](repo-branch-state.md) records that `main` is
the implementation source of truth, while `origin/harness/autonomous-v1-delivery`
contains newer hardening notes. Future branches should use the convention above
instead of adding more unrelated naming schemes.

# Connected Concepts

* [Current repository branch state](repo-branch-state.md)
* [Phase 6 hardening bugs](phase6-hardening-bugs.md)
* [Autonomous harness](autonomous-harness.md)
* [Ponytail audit observations](ponytail-audit-observations.md)

# Citations

* User note, 2026-06-15: branch naming should at least follow `Vx/phasexxx`.
* `.planning/phases/*`
* `git`
