---
type: Process Artifact
title: Current Repository Branch State
description: Latest implementation is on main; the newer harness branch contains planning and bug reports but stale app code.
resource: git
tags: [process, git, branches, source-of-truth]
timestamp: 2026-06-15T19:00:00+03:00
---

# Source Of Truth

Latest implementation branch:

* `origin/main` at `3f35710`
* Subject: `Merge V1 (phases 1-5 + harness) into main for QA deploy`
* Parents: `e99818b` and `3e9adca`

`origin/v1-delivery` is contained in `origin/main`.

# Important Non-Implementation Branch

`origin/harness/autonomous-v1-delivery` at `121cad7` is newer by commit date but
is not based on the V1 implementation. It contains [Phase 6 hardening bugs](phase6-hardening-bugs.md)
and plan files, but it should be treated as reference material only.

# Practical Rule

Start implementation work from `main`. Import or rebase planning material from
the harness branch as needed.

Future delivery branches should follow [Version and phase branch naming](version-phase-branch-naming.md)
so implementation branches, planning folders, and knowledge notes remain easy
to connect.

# Citations

* `git show origin/main`
* `git merge-base --is-ancestor origin/v1-delivery origin/main`
* `git merge-base --is-ancestor origin/harness/autonomous-v1-delivery origin/main`
