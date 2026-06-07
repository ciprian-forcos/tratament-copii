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
  - Key (persists outside the repo): `C:\Hermes\.ssh\tratament_deploy`
    (sandbox path: `/sessions/<id>/mnt/Hermes/.ssh/tratament_deploy`)
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

## Open blockers / escalations

_(none yet — the orchestrator appends here on any stop condition, with the
plan, the finding, and what decision it needs from the human)_

## Last updated

_(orchestrator stamps session + plan transition here)_

## Run log (orchestrator-driven; appended each transition)

- **Setup** — v1-delivery constructed = main + harness + phase-01 (merges
  conflict-free). Gate green on base (type-check ✓, 11 tests ✓, build ✓).
  Pushed to origin. Agent-tool spawn verified (Sonnet worker, sandbox+key OK).
  Operational facts for this environment:
  - Build clone: `/tmp/v1-build` (deploy key in `core.sshCommand`).
  - Subagent Read/Edit tools do NOT reach `/tmp`; implementers author code via
    shell (`cat`/`sed`/`python`) and read via `cat`.
  - Gates run **synchronously** — backgrounded processes die between calls.
  - The **orchestrator drives all spawns** (incl. the mechanical-review loop);
    subagents cannot spawn subagents in Cowork.
- **01-01 dose records** — Tier-2 APPROVE (inline Opus; code pre-vetted at
  human checkpoint). intent/spec/ux/integration/data-safety all hold.
  Status: **done**. Tip: 4adc761.
- **02-01 night timeline** — implementing (Sonnet Implementer spawned).
- **02-01 night timeline** — Tier-1 gate verified green (type-check/lint/test
  26✓/build), SHA matches remote, TDD rhythm clean. Tier-2 APPROVE (intent/
  spec/ux/integration/data-safety all hold; reactive via doseStore.subscribe).
  Deviation noted for human: added eslint.config.js + `typescript-eslint`
  devDep to satisfy the required lint gate (repo had no lint config); dev-only,
  does not affect the shipped bundle. Removed unused `timeline` prop (no caller).
  Status: **done**. Tip: a7c46a1.
- **03-01 schedule-engine (research/adapter)** — implementing.
- **03-01 schedule-engine research** — FINDINGS.md written; engine is a
  forward projection (no AdministeredDose input). Decision: approve-as-proposed
  — adapter `earliestRepeat()` bridges actual last-dose times to per-med
  interval rules; alternation + 2h floor stay in dosePlan; NO engine changes;
  Phase 3 stays 2 plans. Status: **done** (research, no gate/PR). Tip: 4173b3e.
- **03-02 schedule-engine implementation** — implementing.
- **03-02 schedule-engine impl** — Tier-1 green (type-check/lint/48 tests/
  build), SHA matches, TDD clean, scope tight (4 plan files only). Tier-2
  APPROVE: nextDoseFor reads doseStore + engine intervals; buildPlan next =
  max(engine ceiling 8h/6h, 2h cross-drug floor); +2h hardcode removed;
  Plan shape unchanged (no PlanCard regression); data-safe. nextDoseFor naming
  reconciliation (vs FINDINGS earliestRepeat) documented. Status: **done**.
  Tip: 0f173d5.  ===> PHASE 3 COMPLETE.
- **04-01 children screen** — implementing.
- **04-01 children screen** — Tier-1 green (type-check/lint/60 tests/build),
  SHA matches, TDD clean, scope tight (only plan files), no CopiiTab import,
  no direct localStorage (uses childStore), legacy tabs intact. Tier-2 APPROVE:
  ≡ opens calm-mode Copii screen (list/edit via ChildEditor/setActive/add/
  back + BSA/height + active-meds), FlowProtoB routing no-regression, data-safe.
  No deviations. Status: **done**. Tip: 4fa6396.  ===> PHASE 4 COMPLETE.
- **05-01 share encode/decode lib** — implementing.
- **05-01 share encoder** — Tier-1 green (type-check/lint/72 tests/build), SHA
  matches, TDD ([test]/[feat]/[refactor]), scope = share/ only, package.json
  unchanged (no new deps). Tier-2 APPROVE: versioned encode/decode, URL-safe
  base64, ShareDecodeError codes, and `temp` provably stripped (privacy).
  Deviation: gzip deferred to keep API sync per the length test (JSON+base64url
  sufficient for V1). Status: **done**. Tip: 153baa5.
- **05-02 share UI** — implementing.
