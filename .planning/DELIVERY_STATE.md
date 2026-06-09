# V1 Delivery State

Single source of truth for the autonomous run (PROCESS.md "Autonomous V1
Delivery"). The orchestrator reads this at the start of every session and
updates it after every plan transition. A plan is **done** only with both
a Tier-1 `SIGNOFF` and a Tier-2 `APPROVE` on the recorded tip SHA.

## Run config (set once at run start)

- **Integration branch:** `v1-delivery`
- **Build clone:** `/tmp/v1-build` (sandbox-native; never the mounted folder)
- **Result delivery:** `push` (configured) — `v1-delivery` is pushed to
  origin via an SSH deploy key (write access). Use it from the build clone:
  - Key (persists outside the repo): `C:\AI Work\.ssh\tratament_deploy`
    (the workspace `C:\Hermes` was renamed to `C:\AI Work`; the key moved with
    it. Sandbox path: `/sessions/<id>/mnt/AI Work/.ssh/tratament_deploy`.
    NOTE: re-point Cowork at `C:\AI Work` at session start so the sandbox can
    reach the key and the repo.)
  - `export GIT_SSH_COMMAND="ssh -i <key> -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"`
  - SSH remote: `git@github.com:ciprian-forcos/tratament-copii.git`
  - Verified working (auth + read + write) on setup. Fallback if the key is
    ever missing: `bundle export` (copy a `git bundle` into the user's folder).
- **Cut v1-delivery from:** `origin/phase-01/01-01-dose-records`
  (this already = `main` + the Phase 1 dose-records work, post-rebase, so
  Phase 1 code is present from commit one and only needs its Tier-2 gate)

## Plan ledger

Status: `pending` → `implementing` → `signoff` (Tier-1) → `done` (Tier-2)
→ or `blocked`.

| Phase | Plan | Depends on | Status | Tip SHA | Blocker |
|-------|------|------------|--------|---------|---------|
| 1. Dose records   | 01-01 | —     | implemented, needs Tier-2 | _(origin/phase-01 tip)_ | — |
| 2. Night timeline | 02-01 | 01-01 | pending | — | — |
| 3. Schedule engine| 03-01 | 01-01 | pending | — | — |
| 3. Schedule engine| 03-02 | 03-01 | pending | — | — |
| 4. Children screen| 04-01 | —     | pending | — | — |
| 5. Share Tier 1   | 05-01 | 04-01 | pending | — | — |
| 5. Share Tier 1   | 05-02 | 05-01 | pending | — | — |
| 5. Share Tier 1   | 05-03 | 05-02 | pending | — | — |

Dependency notes (from ROADMAP.md): Phase 2 and Phase 3 both need Phase 1's
real "last dose" data. Phase 5 needs Phase 4's children screen. Phase 4
depends only on the Phase 0 baseline, so it can run early/in parallel
conceptually — but on one linear branch the orchestrator still sequences
it; pick an order that keeps each Design-Review diff small.

## Suggested execution order

`01-01 (Tier-2 only) → 02-01 → 03-01 → 03-02 → 04-01 → 05-01 → 05-02 → 05-03`

---

## Phase 6 — V1 Hardening run (post-QA)

Separate autonomous run from the V1 build above. Plans + wave map:
`.planning/phases/06-hardening/` (see `06-00-OVERVIEW.md`).

### Phase 6 run config

- **Base branch:** `main` (the deployed V1).
- **Integration branch:** `v1-hardening` (cut from `origin/main`).
- **Build clone:** `/tmp/v1-build` (sandbox-native; never the mounted folder).
- **Result delivery:** `push` via the SSH deploy key (path corrected above).
- **Waves (file-disjoint):** A = 06-01 + 06-05 + 06-06 (parallel);
  B = 06-02 + 06-04 (parallel); C = 06-03 (serial, after A+B).
- **Release:** when all six plans hold Tier-1 SIGNOFF + Tier-2 APPROVE and phone
  QA passes, the human merges `v1-hardening` → `main` and stamps **`v1.0.0`**.

### Phase 6 plan ledger

Status: `pending` → `implementing` → `signoff` (Tier-1) → `done` (Tier-2) → `blocked`.

| Plan  | Wave | Depends on        | Status  | Tip SHA | Blocker |
|-------|------|-------------------|---------|---------|---------|
| 06-01 | A    | —                 | pending | —       | —       |
| 06-05 | A    | —                 | pending | —       | —       |
| 06-06 | A    | —                 | pending | —       | —       |
| 06-02 | B    | —                 | pending | —       | —       |
| 06-04 | B    | —                 | pending | —       | —       |
| 06-03 | C    | 06-01, 06-02      | pending | —       | —       |

### ⚠️ Pre-run check (must resolve before Wave A)

The mounted checkout's `dosePlan.ts` is the naive prototype (hardcoded 2h, no
schedule-engine wiring) and there is no children screen; yet the V1 ledger above
lists Phases 2–5 as not-yet-Tier-2. Confirm what is actually on `main` after
cloning. The Phase 6 plans were grounded against the **working-folder** code on
2026-06-07; if `main` differs, re-ground 06-01 / 06-03 / 06-05 before editing.

## Open blockers / escalations

_(none yet — the orchestrator appends here on any stop condition, with the
plan, the finding, and what decision it needs from the human)_

## Last updated

2026-06-07 — Phase 6 plans authored + corrected against the checkout; ROADMAP
and this ledger registered; deploy-key path fixed for the `C:\AI Work` rename.
The autonomous Phase 6 run itself is NOT yet started (the bash sandbox lost its
mount mid-session; start the run in a fresh session re-pointed at `C:\AI Work`).
