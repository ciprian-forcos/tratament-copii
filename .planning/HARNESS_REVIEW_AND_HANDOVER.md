# Claude Agent Harness Review & Handover

**Date**: 2026-06 (session)
**Reviewer**: Grok (in this conversation)
**Context**: User is using `tratament-febra-copii` development (specifically the harness scaffolding on `harness/autonomous-v1-delivery`) as a real-world "honing stone" and educational project for building and iterating on autonomous/multi-agent harnesses for Claude Code / Cowork-style workflows.
**Repo state at start of review session**: See "Restored State" section below.

## 1. Executive Summary

The harness experiment largely succeeded at its meta-goal: it produced a traceable, gate-enforced, mostly autonomous delivery of the full remaining V1 scope (Phases 1–5) on a single integration branch (`v1-delivery`), using strict TDD rhythm, fresh sub-agents per cycle, literal gate verification, and a three-tier review (Sonnet mechanical → Opus judgment → final human). The result was merged to `main` and deployed to the live GitHub Pages site.

However, the local workspace the user was actively developing in (`harness/autonomous-v1-delivery`) was the *harness scaffolding itself*, not the delivery branch. The full V1 implementation had already run to completion on remote branches before this review session. The heavy process documentation, prompts, and rules were present and consistent, but the actual feature work for V1 lived elsewhere.

Manual QA on the live deployed app (exactly as the harness's own `QA_HANDOFF.md` prescribed) surfaced 13 real issues. Several of these are material to the "3 AM, 41°C, exhausted parent" use case defined in `BRIEF.md`. This demonstrates both the strength (the harness got working code shipped with 113 tests) and the limitation (mechanical + judgment tiers still left meaningful UX, correctness, and scope-adherence gaps that required human eyes on the real product).

The repo has been restored (via `git reset --hard HEAD`) to the state observed at the beginning of this review session.

## 2. Restoration of Initial Repo State

**Commands executed to restore**:
- `git reset --hard HEAD`

**Resulting state** (matching the initial observation in this session):
- Branch: `harness/autonomous-v1-delivery`
- HEAD: `e92ce973` ("[harness] add autonomous V1 delivery: orchestrator + 3-tier review")
- Branch up to date with `origin/harness/autonomous-v1-delivery`
- Working tree: clean for tracked files (`nothing added to commit but untracked files present`)
- Untracked: `Bug reports/` (with the `List` the user recreated from prior manual testing — this was also present/untracked in the initial listing)
- Source tree: Phase 0 baseline (design B GUI + Vitest/RTL smoke test from `00-02`). No `doseStore.ts`, `useNightTimeline`, `scheduleAdapter`, `ChildrenScreen`, `ShareSheet`, `ImportGate`, or related tests in `src/`.
- `.planning/`: Full set of harness artifacts in the "pre-full-run" snapshot state (detailed `PROCESS.md`, `BRIEF.md`, `ROADMAP.md` showing Phases 1–5 as not started on the ledger, individual `*-PLAN.md` files for all phases, prompts for orchestrator/implementer/agent-reviewer/design-reviewer, `V1_ACCEPTANCE.md`, `TEST_CONVENTIONS.md`, `HANDOFF_TEMPLATE.md`, etc.).
- Other: `dist/`, `assets/`, PWA files, `specs/`, `scripts/`, `node_modules/`, etc. as in the initial listing.

This matches the "git status at the start of the conversation" and the first `list_dir` (working tree clean on the harness branch, with the planning harness fully documented but V1 phases still pending in the local view).

**Note on prior session actions**: Earlier in the review, files from `origin/phase-01/01-01-dose-records` were temporarily checked out for inspection (to understand what "implemented, needs Tier-2" meant). This left staged/added files (`doseStore.*`, `PlanCard.test.tsx`, etc.). The reset removed that pollution cleanly.

## 3. Harness Review (as a System for Autonomous Delivery)

### What the harness got right (strengths observed)

- **Honesty and mechanical verification as first-class citizens**: The "Status Report Honesty" section in `PROCESS.md` (literal gate output, remote SHA verification, blocker resolution table with file:line evidence, forbidden phrasings like "all tests pass" without the vitest line) directly attacks the most common agent failure modes. The `scripts/verify-plan.sh` + Agent-Reviewer loop enforces it. This is excellent engineering for agent harnesses.

- **Fresh sub-agents per cycle and role separation**: Requiring a *fresh* Agent-Reviewer (Sonnet) for every inner loop cycle, and a separate Design-Reviewer (Opus) only after SIGNOFF, is a smart bias-mitigation technique. The handoff template (`handoffs/HANDOFF_TEMPLATE.md`) for context pressure is pragmatic.

- **Single long-lived integration branch (`v1-delivery`)**: Explicitly chosen to avoid the git index corruption problems on the user's Windows mounted filesystem. This was a real, environment-aware decision, not cargo-cult.

- **TDD rhythm as a hard, verifiable requirement**: Plans mandate a visible `[test]` commit before any `[feat]` for new units. The Agent-Reviewer is instructed to check `git log`. In the actual run (visible on `v1-delivery`), this rhythm was followed.

- **Three-tier cost model**: Mechanical (cheap Sonnet + script) → Judgment (expensive Opus only when needed) → Human (only at the very end on the assembled V1). The `QA_HANDOFF.md` and phone-based acceptance checklist are exactly the right shape for the final human gate.

- **Environment discipline**: Strong emphasis on the build clone (`/tmp/v1-build` on native FS), not running gates on the mounted Windows folder, SSH deploy key for push delivery, etc. This shows hard-won experience with flaky agent environments.

- **Self-documenting run log**: The orchestrator is required to append to `DELIVERY_STATE.md` (run log section). The actual run did this, plus produced per-plan `*-SUMMARY.md` files and a final `QA_HANDOFF.md`.

- **Scope discipline baked in**: Repeated explicit calls in BRIEF, PROCESS, and plans about protected localStorage keys, "NOT in V1" items, legacy tabs staying as reference, no touching `package.json` deps outside plan scope, etc.

### What felt heavy or problematic (friction / risks)

- **Extreme ceremony relative to project size**: This is a small Romanian PWA with one primary panic flow + calm children management + Tier-1 share. The amount of process machinery (orchestrator prompt, 4 agent prompt files, 2 reviewer agent .md files, HANDOFF_TEMPLATE, verify-plan.sh, DELIVERY_STATE ledger, per-plan PLAN/SUMMARY, V1_ACCEPTANCE, TEST_CONVENTIONS, multiple tiers, context handoff rules, "literal output only" rules, etc.) is disproportionate. It works as a *research vehicle / honing stone* (user's stated purpose), but would be exhausting for most real product work.

- **The run was "elsewhere"**: The user was developing the harness scaffolding on `harness/autonomous-v1-delivery`. The actual delivery run happened on a separate `v1-delivery` branch (cut from the phase-01 tip), was pushed via the configured SSH key in the sandbox, and later merged. The local tree the user lives in never saw the feature work until we inspected remotes. This is by design (mounted FS unreliability), but it means the "honing" happens at one remove from the code being delivered.

- **Windows + PowerShell realities**: Several commands in the session (and in the harness docs) assume bashisms (`head`, `| head -N`, etc.). The user's shell is PowerShell. The `git clean`, `git checkout -- .`, etc. worked, but the environment assumptions in `PROCESS.md` (Linux sandbox at `/tmp`, specific SSH key path) are not trivial to replicate for the person actually iterating on the harness.

- **Agent-Reviewer / Implementer split is powerful but expensive in tokens and latency**: Requiring fresh sub-agents + full gate re-runs + literal output comparison on every cycle is correct for quality, but multiplies cost. The 5+ cycle limit before escalation is a good safety valve.

- **Design-Reviewer still relies on the Implementer summary being honest**: The Opus reviewer gets the Implementer's handback summary. If that summary is incomplete or misleading about user-visible behavior, the judgment tier can be gamed (even if the mechanical tier is strict).

- **No "stop and ask human" for genuine product ambiguity until late**: The stop conditions are good (3x CHANGES, data-safety, etc.), but the plans themselves sometimes contain underspecified real-world behavior (see bugs below around last-dose time entry, exact cross-drug rules, what "night" really means for the timeline).

### Educational / honing value (user's explicit goal)

This project is an outstanding testbed precisely because:
- It has a clear, emotionally compelling "one moment" (3 AM, 41°C) that makes UX and correctness failures obvious.
- It has real persistence invariants (the three localStorage keys) that must never be broken.
- It has a non-trivial schedule engine that was pre-existing (good for adapter/research plans like 03-01/03-02).
- It mixes panic-mode (high-stakes, low-cognition) and calm-mode (management) surfaces.
- The autonomous run actually completed and shipped, giving real data on whether the process produces usable output.

The later harness commits visible on `v1-delivery` (e.g., "require hosting each version on GitHub Pages for mobile QA", "document verified Cowork facts + parallel-wave execution") show the user iterating on the harness *based on what the run actually exposed*. This is exactly the right use of the project.

## 4. Findings on the Overall State of the Repo

### Branch / delivery reality (discovered during review)

- `harness/autonomous-v1-delivery` (local + origin): The harness scaffolding + prompts + PROCESS docs. This is where harness development happens. Pre-V1 feature state in the source tree.
- `main` (origin): Contains Phase 0 + the full V1 merge (`3f35710` "Merge V1 (phases 1-5 + harness) into main for QA deploy").
- `v1-delivery` (origin): The actual autonomous run branch. Contains the complete execution of 01-01 through 05-03 with proper `[test]` → `[feat]` commits, delivery marker commits, 05-03-SUMMARY, QA_HANDOFF.md, and the final feature-complete state (113 tests).
- `phase-01/01-01-dose-records` (origin): The pre-autonomous Phase 1 work (dose records) that the v1-delivery run was cut from. Had its own Agent-Reviewer cycles and fixes.

The autonomous delivery described in `PROCESS.md` ("orchestrator drives the loop, Implementer + fresh Agent-Reviewer inner loop until SIGNOFF, then Design-Reviewer, record in DELIVERY_STATE, repeat until V1 acceptance") **actually executed** on this project. All 8 plan-units were delivered through the Sonnet→Opus gate chain. `QA_HANDOFF.md` was produced with the exact phone-based checklist the process promised.

The live site (`https://ciprian-forcos.github.io/tratament-copii/`) is the post-merge main (new bundle hash, full PWA shell).

### Planning artifacts

Extremely thorough and internally consistent. `PROCESS.md` is the contract. `BRIEF.md` is the north star (the 3 AM moment, the stopwatch criteria, explicit "NOT in V1" list). `V1_ACCEPTANCE.md` is the concrete checklist. Per-phase plans are atomic and reference the right context files. The fact that the run produced matching SUMMARYs and updated the ledger shows the process was followed (at least mechanically).

One meta-observation: the ROADMAP and DELIVERY_STATE files in the v1-delivery tip still showed the "starting" ledger in some `git show` views because the orchestrator appends to the run log rather than mutating the table aggressively in every commit. The human-facing truth is in the commit messages + QA_HANDOFF + per-plan SUMMARIES.

### Implementation state on the restored branch

Baseline only (Phase 0). The real V1 code (dose persistence, real timeline hook, schedule adapter replacing `+2h`, ChildrenScreen + ≡ routing, full Tier-1 share encode/decode/merge/ImportGate with `temp` privacy invariant) lives on the remote `v1-delivery` tip and the merge on main.

Legacy tabs (`MedicamenteTab`, `CopiiTab`, `ProgramTab`) are still present, as required by the "Forbidden" rules.

## 5. Take on the Bugs Found in Manual Testing

The `Bug reports/List` (13 items) is excellent, high-signal manual QA performed on the *live deployed product*, exactly as the harness process intended for the final human gate. Here is my categorized analysis:

### Critical for the core 3 AM promise (BRIEF stopwatch criteria + panic flow)

- **#2** ("mai sunt 2h 0m" shown with default before any treatment): Directly breaks the "parent opens the app, sees one big clock..." vision. The next-dose affordance should be conditional on having started a plan.
- **#3** (timeline glowing ball at extreme right; "Now" should be in the middle): The night timeline is the parent's memory. Wrong visual model destroys trust.
- **#4** (temperature header click doesn't let you set the value; expected 3-button model): Core flow breakage in the calm → panic transition.
- **#11** (Step 2 time entry is only presets + broken "alt..." button; no real wheel/calendar for multi-day history): This is a major real-world gap. The BRIEF and plans assume "first/last" are recent. Parents often arrive after doses over days. The plan for 02-01/03-02 didn't force a robust historical time picker.
- **#7** (cross-drug spacing is 4h in the rules but the app doesn't honor it correctly): Phase 3's explicit goal was to replace the hardcoded `+2h` with the real engine + min-spacing rules. If the live behavior on the deployed site doesn't match the schedule rules for Nurofen ↔ Panadol, the adapter or the call site in `buildPlan` has a bug (or the rules data was not the source of truth).

### Scope and "NOT in V1" discipline

- **#6** (no way to add medicines, not even defaults): Explicitly out of V1 per BRIEF. The absence became very visible once the calm children screen existed. The legacy tabs had the functionality; the new surface doesn't surface it at all.
- **#8** (BSA / height line in Copii menu): Carry-over from the old `CopiiTab` / `doseCalculation.ts` that shouldn't have been ported into the design B children screen. Good that the user flagged it for removal without test burden.

### Polish, copy, and chrome (important for calm tone)

- **#5** ("Măsoară din nou" → should be "Temperatura").
- **#9** (Step 2 copy: "Ai mai dat ceva?" → "Ai mai administrat altceva?").
- **#4** (top-right status icons: battery, signal, three dots — pure visual noise from the old design).
- **#1** (no obvious "Add to Home Screen" affordance): Reasonable user expectation for a PWA, even if not in the strict original brief.

### Safety / correctness

- **#12** (Virodep appearing in "Ultima doză a fost..."): The plans and BRIEF are clear: only the four antipyretics. Non-antipyretics leaking into the panic flow is exactly the kind of scope violation the process tried to guard against.
- **#13** (the "peste 39.5°C apelează 112/pediatru" banner): The user is right that the threshold and the suggested actions are not accurate for the target audience. Removing alarming but imprecise medical advice is the correct short-term move. The harness process didn't have a strong "medical safety review" tier.

### Observations on why these survived the harness

- The Agent-Reviewer tier is purely mechanical (gate, SHAs, TDD shape, scope of changed files). It would have passed as long as tests were green and the declared files matched.
- The Design-Reviewer (Opus) is supposed to catch "intent met", "UX at the 3 AM bar", "integration", "data safety". Several of the bugs above (timeline model, last-dose time entry, cross-drug spacing, medicine filtering, copy tone, chrome) are exactly the things the Design-Reviewer prompt asks the reviewer to walk in their head or via the built output. Either the reviewer didn't have a good enough mental model of the real parent use case, or the Implementer's summary understated the user-visible behavior.
- The final human gate (the user's manual testing on the phone) is doing exactly the job the process designed for it. The fact that 13 issues were found after the internal tiers signed off is not a failure of the harness — it is evidence that the final human gate remains necessary.

## 6. Overall Assessment

The harness, as an experiment in reliable autonomous delivery, performed well for its educational purpose. It enforced enough structure that a complete V1 feature set (dose records + real timeline + real schedule engine + children management + Tier-1 share with privacy) was delivered with visible TDD, gates, and documentation, then merged and deployed.

The process did not (and could not) eliminate the need for thoughtful human review of the real product. The bugs found are the right kind of signal for the next iteration of the harness (better prompts for the Design-Reviewer around the BRIEF's "one moment", stronger requirements for time-picker and historical last-dose flows in the plans, explicit medicine filtering rules in the acceptance checklist, etc.).

For the actual app: V1 as defined in the BRIEF is *close* but not yet at the quality bar implied by "optimized for 3 AM, no one has slept in 36 hours." The manual bug list is the actionable backlog.

## 7. Recommendations (for the harness project)

- Treat the current `Bug reports/List` + the QA_HANDOFF checklist as gold input for the next harness iteration (add explicit test cases or plan requirements for the failing scenarios).
- Consider adding a lightweight "UX scenario checklist" that the Design-Reviewer must explicitly walk (with the built output or in-head simulation) before APPROVE.
- Make the "last dose time entry" problem a first-class concern in any future plan that touches Step 2 or the schedule adapter.
- Document the Windows/PowerShell friction points you hit while honing the harness.
- Consider a lighter "manual mode" path in PROCESS.md for when the full autonomous ceremony is overkill for a small change.

The repo is now in the restored initial state. The handover file is this document.

---

**End of report.** The file lives at `.planning/HARNESS_REVIEW_AND_HANDOVER.md`. You can commit it on the harness branch if you want a record of this review session.