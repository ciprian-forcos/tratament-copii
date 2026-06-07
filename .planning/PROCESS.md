# Subagent + Review Protocol

This file is the contract between the user (reviewer) and the subagent
(implementer). Every PLAN.md links here. Subagents follow this verbatim.

## Roles

- **Human Reviewer**: the user, via Claude in the parent conversation. Final
  authority. Sees a plan's work only after the Agent-Reviewer has signed off.
  Merges PRs.
- **Implementer**: a subagent spawned per plan. One subagent per plan.
  Starts cold, reads the PLAN.md, executes, runs the inner loop with the
  Agent-Reviewer until passing, then presents to the Human Reviewer.
- **Agent-Reviewer**: a separate subagent spawned by the Implementer (or by
  the harness) after each push. Its job is mechanical verification — not
  judgment. It runs the gate commands itself, compares their literal output
  to the Implementer's status report, and verifies every blocker from any
  prior Human-Reviewer round has been resolved with file:line evidence. It
  returns either `SIGNOFF` (all checks pass) or a `FINDINGS` list (specific
  discrepancies). The Implementer fixes findings and re-submits. This loop
  repeats until `SIGNOFF`. Only then is the work presented to the Human
  Reviewer.

## Definitions

- **Requirement**: any numbered or bulleted item in a Human-Reviewer or
  Agent-Reviewer message labeled "Blocker", "Mandatory fix", or any item
  inside a numbered `<task>` block in a PLAN.md. Items labeled "Nit" are
  not requirements. Each requirement is resolved or not — there is no
  partial credit.
- **Resolved**: the requirement's stated condition is met AND verifiable
  via a specific command, file:line reference, or test name. The
  Implementer must paste the verifying evidence in its status report.
- **Blocker**: a requirement whose failure prevents merge.
- **Gate**: the four commands listed in "The pre-PR gate" section. All
  must exit 0 before any status report claims the gate passes.
- **Literal output**: the actual text emitted by a command, verbatim, not
  paraphrased or summed in the head.

## Branching

- `main` is protected. Never push to `main` directly.
- Each plan = one feature branch.
- Branch naming: `phase-{NN}/{plan-id}-{short-name}` (e.g.
  `phase-01/01-01-dose-records`).
- Branches are based on `main` at the time of branch creation. If `main` has
  moved since the previous merged PR, rebase before opening the PR.

## Versioning & releases

We version the deployed app with semantic versioning, adapted for a local-first
PWA. The compatibility contract that matters here is **persisted data**
(localStorage keys + the share-URL format), not a public code API — so that is
what drives the MAJOR axis.

- **Branch names stay phase/plan-based** (see above). We do *not* name branches
  after versions; the phase/plan scheme carries more meaning for this roadmap.
- **The version lives in `package.json` and a matching git tag `vX.Y.Z` on
  `main`.** Tags are the record of what was deployed and the rollback points.

### Pre-1.0 (building V1 — current state)

We are pre-release, so versions are `0.MINOR.PATCH`:

- Each completed **roadmap phase** that merges to `main` = a **MINOR** bump
  (Phase 0 → `0.1.0`, Phase 1 → `0.2.0`, … Phase 5 → `0.6.0`).
- A fix-only deploy between phases = a **PATCH** bump (`0.2.1`).
- When all of V1 scope ships and meets the BRIEF success criteria → **`1.0.0`**.

### Post-1.0 (full semver)

- **MAJOR** — a breaking change to persisted data: renaming/removing a
  localStorage key or changing the share-URL schema so existing user data no
  longer loads. (This is the same event the *Forbidden* section guards against.)
- **MINOR** — a new user-facing feature, backward-compatible with stored data.
- **PATCH** — a bug fix with no schema change.

### Release steps (after a phase's PR squash-merges to `main`)

1. On `main`: bump `version` in `package.json`.
2. `git tag vX.Y.Z && git push --tags`.
3. GitHub Pages auto-deploys from `main`; the tag marks exactly what is live.

Optionally record user-facing changes per version in `CHANGELOG.md`
(Keep a Changelog style).

## TDD workflow per plan

1. **Read** the PLAN.md top to bottom. Read every `@file` referenced.
2. **Branch** from `main` (or the prior PR's branch if there is a hard
   dependency stated in the plan).
3. **Write failing tests first** for the unit being built. Commit them with a
   message like `[test] add failing tests for <unit>`. Tests must fail because
   the code doesn't exist or doesn't behave correctly, **not** because of an
   import error. The git history must show this commit separately from the
   implementation commit — a single `[feat] X (TDD)` commit does not satisfy
   this rule because the failing-first state was never recorded.
4. **Implement** the minimum code that makes the new tests pass. Commit:
   `[feat] implement <unit>`.
5. **Refactor** if needed while keeping tests green. Commit: `[refactor] ...`.
6. **Run the full gate** (see below). All checks must pass before pushing.
   If any check fails, fix and recommit — do **not** push.
7. **Push** the branch.
8. **Enter the Implementer ↔ Agent-Reviewer loop** (see section below). Do
   not contact the Human Reviewer until the Agent-Reviewer returns
   `SIGNOFF`.
9. **Present to Human Reviewer** by opening the PR using the template below.
10. **Stop** and wait for human review. On Human-Reviewer findings, re-enter
    step 6 (gate) → step 8 (Agent-Reviewer loop) → step 9 (re-ping
    Human Reviewer). New commits, not amends.

## The pre-PR gate

All of these must pass on the feature branch before the PR is opened:

```
npm run type-check        # tsc --noEmit, strict TypeScript
npm run lint              # eslint .
npm run test              # vitest (added in Phase 0)
npm run build             # tsc -b && vite build
```

If a plan touches the service worker, also confirm `sw.js` cache name was
auto-bumped by the Vite plugin (existing behavior — verify in dist output).

## Status Report Honesty

This section exists because we have an established pattern of Implementer
status reports that don't match the state of the repo. Reports that violate
the rules below are treated by the Reviewer as "not done" regardless of
what was actually implemented.

Every status report (to either Agent-Reviewer or Human Reviewer) MUST
include the following, verbatim:

### 1. Literal gate output

Paste the final 3 lines of each gate command's stdout/stderr:

```
$ npm run type-check
<paste last 3 lines>

$ npm run test
<paste last 3 lines — must include the "Tests N passed (N) | M failed (M)" line>

$ npm run build
<paste last 3 lines>
```

Do not summarize. Do not sum test counts mentally. If vitest reports
`Tests 11 passed (11)`, quote that line. If anything is not 0-exit, the
gate failed — report that, do not push, do not request review.

### 2. Remote verification

```
$ git rev-parse HEAD
<sha>

$ git ls-remote origin refs/heads/<branch>
<sha> refs/heads/<branch>
```

The two SHAs must match. If they don't, your push didn't land. Do not
request review until they match.

### 3. Blocker resolution table

For every blocker raised by the Human Reviewer or Agent-Reviewer in the
most recent feedback message, paste one row in this exact shape:

```
- Blocker: <first 8–10 words of the original blocker text, quoted>
  Status:  resolved | not resolved | partially resolved
  Commit:  <SHA of the commit that resolves it>
  Evidence: <file:line OR test name OR command output that proves it>
```

"Partially resolved" and "not resolved" are valid statuses — but they
block the loop from signing off. They are honest. "Resolved" without
matching evidence is the failure mode this section exists to prevent.

### 4. Forbidden phrasings

The Implementer may not write:

- "X tests passing" without the literal vitest summary line.
- "Common in [tool]" or "environmental" as a substitute for fixing a
  failing test.
- "Works in the running app" instead of fixing a failing automated test.
- "Gate passes" without the literal output of every gate command.
- "All tests pass" when any test fails. There is no "but" clause.
- Subset counts that omit a failing test from the total.

Any of these in a report is grounds for the Agent-Reviewer to return
`FINDINGS` without further checking.

## Implementer ↔ Agent-Reviewer Loop

After each push, the Implementer hands its status report to a fresh
Agent-Reviewer subagent. The Agent-Reviewer's job is mechanical
verification — it does not judge taste or architecture, only fact.

### Agent-Reviewer steps

1. Pull the branch from origin. Confirm the tip SHA matches the
   Implementer's claim via `git ls-remote`. If not → `FINDINGS: branch
   tip mismatch`.
2. Run each gate command itself. Compare the literal final 3 lines to
   what the Implementer pasted. Any discrepancy → `FINDINGS: gate output
   mismatch — claimed X, actual Y`.
3. Verify each row of the Blocker Resolution Table:
   - For "resolved" rows: open the cited file at the cited line and
     confirm the change is present. Run the cited test/command and
     confirm it passes. If the evidence doesn't hold → `FINDINGS:
     blocker N evidence does not verify`.
   - For "not resolved" / "partially resolved" rows: that's also a
     finding. Loop continues.
4. Check for silent regressions: `git diff main..HEAD --stat` and skim
   for files that aren't in the plan's scope. If unexpected files
   changed, flag them as findings.
5. Verify the TDD commit shape: `git log main..HEAD --oneline` should
   show a `[test]` commit before any `[feat]` commit on the branch for
   any new unit added. If not → `FINDINGS: TDD rhythm not visible in
   git history`.

### Loop termination

- If the Agent-Reviewer's check produces zero findings, it returns
  `SIGNOFF` plus a one-line summary. Only then may the Implementer
  open or update the PR for the Human Reviewer.
- If there is any finding, the Agent-Reviewer returns a numbered
  `FINDINGS` list. The Implementer reads the findings, fixes, runs the
  gate again, pushes, and spawns a new Agent-Reviewer. Repeat.
- There is no maximum iteration count, but if the loop has run more
  than 5 cycles on the same plan, the Implementer must hand off to the
  Human Reviewer with `STUCK: <description>` instead of looping further.

### Why a separate subagent

The Implementer has an implicit incentive to declare completion. The
Agent-Reviewer has no such incentive — its task is to find discrepancies.
Splitting the two roles into separate cold-start subagents removes the
self-confirmation bias that produced the round 1–3 failures.

The Agent-Reviewer must be a **fresh subagent** for each cycle. Do not
reuse the same agent instance for multiple cycles — context that
includes the Implementer's prior justifications biases the verification.

## PR template

The PR body must contain (note: the Status Report Honesty section above
defines mandatory verbatim blocks — those go inside this template):

```markdown
## Plan
`.planning/phases/{NN-name}/{NN}-{MM}-PLAN.md`

## Agent-Reviewer signoff
`SIGNOFF` from agent <id/cycle-number> on commit <SHA>.
[The Implementer may not open this PR without a SIGNOFF.]

## Summary
[1–3 bullets describing what changed and why.]

## Files changed
[Bulleted list of files touched, grouped by created / modified / deleted.]

## Tests
- New tests: [path → what they cover]
- Coverage of the new unit: [briefly: what's covered, what isn't]

## Gate (literal output — see "Status Report Honesty")
```
$ npm run type-check
<last 3 lines>

$ npm run test
<last 3 lines>

$ npm run build
<last 3 lines>
```

## Remote verification
```
$ git rev-parse HEAD
<sha>
$ git ls-remote origin refs/heads/<branch>
<sha> refs/heads/<branch>
```

## Blocker resolution
[Table per Status Report Honesty §3, OR "No prior blockers" for the first
submission of a plan.]

## Manual smoke check
[What you tested in the running app, with steps.]

## Deviations from the plan
[Anything you did that the plan didn't say to do, with rationale. If none, say
"None".]

## Open questions for the Human Reviewer
[Anything the human needs to decide, or "None".]
```

## Human Review process

Reaches the Human Reviewer only after the Agent-Reviewer has emitted
`SIGNOFF`. The Human Reviewer's role is judgment, not mechanical
verification (the Agent-Reviewer already did the latter).

1. Read the PR description. Confirm the `Agent-Reviewer signoff` block
   names a SIGNOFF and a commit SHA.
2. Confirm the SHA in the SIGNOFF matches the PR's HEAD via
   `git ls-remote origin refs/heads/<branch>`. If they don't match, the
   Implementer pushed after signoff — reject and require a fresh
   Agent-Reviewer cycle on the current tip.
3. Read the diff. Focus on judgment-level concerns: design choices,
   readability, hidden assumptions, scope creep. The Agent-Reviewer has
   already checked mechanical correctness — don't re-litigate gate
   output.
4. Optionally re-run locally:
   ```
   git fetch && git checkout <branch> && npm install && npm run test && npm run dev
   ```
5. Walk through the new behavior in the running app for any UI-touching
   plan.
6. Leave comments on the PR:
   - **Blocker** comments must be resolved before merge (re-enter the
     inner loop).
   - **Nit** comments are optional.
7. Approve (merge), or request changes (back to inner loop).

## Addressing Human Review comments (Implementer side)

- Push **new commits**. Do **not** amend, do **not** force-push. The review
  history must be readable.
- Re-run the full gate after each round of changes.
- **Re-enter the Agent-Reviewer loop** with the new commit. Only after a
  fresh SIGNOFF on the new tip do you ping the Human Reviewer back.
- Reply on each comment thread explaining what changed, with commit SHA
  and file:line evidence (same as the Blocker Resolution Table format).
- When all blocker comments are resolved AND a fresh SIGNOFF exists on
  the current tip, ping the Human Reviewer.

## Merging

- Reviewer merges via "Squash and merge" once approved.
- Squash commit title: `[phase-{NN}] {plan title}`.
- Delete the branch after merge.
- The implementer then writes `SUMMARY.md` for the plan (see PLAN.md output
  section) and the roadmap progress table is updated.

## Forbidden

- No force-push to shared branches.
- No `git commit --no-verify`.
- No skipping the failing-tests-first step.
- No combining `[test]` and `[feat]` into a single commit — TDD must be
  visible in git history.
- No status reports that violate the rules in "Status Report Honesty".
- No bypassing the Agent-Reviewer loop. The Human Reviewer is not the
  first reviewer; the Agent-Reviewer is.
- No reusing the same Agent-Reviewer subagent for consecutive cycles —
  must be fresh each cycle.
- No touching `package.json` dependencies that aren't in the plan's
  `<files>` list, except `devDependencies` explicitly named by the plan.
- No changes to existing localStorage key names
  (`tratament-copii-children`, `tratament-copii-active-child`,
  `tratament-copii-medications`). New keys must be additive.
- No deletion of the old tab components (`MedicamenteTab`, `CopiiTab`,
  `ProgramTab`) in V1 — they are reference material until V1 fully replaces
  their functionality.
- No silent changes to files outside the plan's declared scope. If a
  change is needed mid-plan, declare it in the Deviations section of the
  status report and PR body.

## Context Management & Subagent Spawning

The thresholds below are stated as observable signals, not as precise
self-measured percentages. Agents generally cannot reliably measure their
own context usage at runtime; a harness-emitted warning is the trigger.

### Agent-Reviewer Subagents
The Agent-Reviewer is **always fresh** for each cycle of the inner loop —
context-management thresholds rarely apply because each cycle is short.
If a single cycle exceeds the harness's context-pressure warning, the
Agent-Reviewer must create a handoff file and spawn its successor before
emitting `FINDINGS` or `SIGNOFF`. The successor finishes the cycle.

---

# Autonomous V1 Delivery

Everything above describes **manual mode**: one plan, branch-per-plan, a
PR, and a Human Reviewer gate. This section adds **autonomous mode** — a
single orchestrated run that delivers the entire V1 roadmap
(`.planning/ROADMAP.md`, Phases 1→5) without a human in the per-plan
loop, and hands the Human Reviewer one finished, built V1 to QA as a real
user. Manual mode still applies to any one-off plan; autonomous mode is
the V1 push.

## Three-Tier Review

Autonomous mode replaces the single Human gate with three tiers, cheapest
first. A plan advances only when each tier in turn passes.

| Tier | Who | Model | Question it answers | Verdict |
|------|-----|-------|---------------------|---------|
| 1. Mechanical | Agent-Reviewer | Sonnet | Did the gate pass, SHAs match, TDD rhythm hold? | `SIGNOFF` / `FINDINGS` |
| 2. Judgment | Design-Reviewer | Opus | Was the *right thing* built — intent, specs, UX-at-3AM, integration, data safety? | `APPROVE` / `CHANGES` |
| 3. Acceptance | Human (you) | — | Does the finished V1 work for a real user? | runs **once**, at the end |

Tier 1 is necessary but not sufficient for Tier 2; Tier 2 runs only on a
Tier-1 `SIGNOFF`. The human never sees per-plan work — only the assembled
V1. This is the cost shape: Sonnet does the labor, Sonnet gates the
mechanics, Opus spends tokens only on judgment, the human spends time
only on the final product.

## Roles in autonomous mode

- **Orchestrator** — the main Cowork session (Opus). Owns the run: reads
  `DELIVERY_STATE.md`, selects the next plan honoring phase dependencies,
  spawns the Implementer, shepherds it through both review tiers, records
  the result, and repeats until V1 is accepted or a stop condition fires.
  The orchestrator does **not** write feature code itself.
- **Implementer** (`.claude/agents/implementer.md`, Sonnet) — one fresh
  instance per plan. Does the TDD work, loops with the Agent-Reviewer to
  `SIGNOFF`, hands back a summary.
- **Agent-Reviewer** (`.claude/agents/agent-reviewer.md`, Sonnet) — fresh
  per inner cycle. Mechanical verification only.
- **Design-Reviewer** (`.claude/agents/design-reviewer.md`, Opus) — fresh
  per plan, after `SIGNOFF`. Judgment verification.

## The orchestration loop

```
load DELIVERY_STATE.md → pick next unblocked plan P
repeat:
  spawn Implementer(P) on the integration branch
      ↳ inner loop: Implementer ⇄ fresh Agent-Reviewer until SIGNOFF
  spawn Design-Reviewer(P, sha)
      ↳ APPROVE  → record P done; advance
      ↳ CHANGES  → hand findings back to a fresh Implementer; repeat
  if same plan returns CHANGES 3× → STOP, escalate to human
until all roadmap plans are done
  → run V1 acceptance (.planning/V1_ACCEPTANCE.md)
  → build + stage a QA preview, write QA handoff
  → ping the Human Reviewer
```

A plan is "done" only when it holds **both** a Tier-1 `SIGNOFF` and a
Tier-2 `APPROVE` on the same tip SHA.

## Integration strategy — one branch, no per-plan PRs

Because no human reviews per plan, per-plan branches + PRs add ceremony
with no payoff, and per-plan merges/rebases are exactly the git
operations that corrupt this repo's index on a mounted filesystem.
Autonomous mode therefore uses **a single long-lived integration
branch**, `v1-delivery`, cut from `main`:

- Every plan's commits land sequentially on `v1-delivery`. The TDD commit
  rhythm is still mandatory and still visible in history.
- No rebases, no merges, no per-plan branch switching during the run —
  only sequential commits, the operation that is reliable here.
- "Base SHA" for a plan's Design-Review diff is the tip recorded for the
  previously completed plan in `DELIVERY_STATE.md`.
- At the end, the Human Reviewer is the one who merges `v1-delivery` →
  `main` (which deploys via GitHub Pages). The harness never auto-merges
  to `main`.

## Execution environment — the build clone

The mounted Windows working folder cannot be the build surface: its
`.git` index corrupts under load, and its `node_modules` holds Windows
binaries that the Linux sandbox can't run (the gate would fail on a
native-module error, not a real one). So the run happens in a **clean
clone on the sandbox's native filesystem**:

```
git clone <origin> /tmp/v1-build        # native FS: reliable git, fast
cd /tmp/v1-build
git checkout -b v1-delivery origin/main
npm install                              # Linux binaries → gate runs for real
```

All Implementer/reviewer git and `npm` operations run in `/tmp/v1-build`.
The user's mounted folder stays their untouched local checkout.

Getting the result back to the user — pick one at run start:
- **Bundle export (default, credential-free):** at V1-done, the
  orchestrator runs `git bundle create` and copies the bundle plus the
  built `dist/` into the user's folder. The user imports the bundle,
  reviews, QAs, and merges. Nothing is pushed; no secret touches the
  session.
- **Push (needs credentials):** if the user provisions a sandbox
  credential (SSH deploy key preferred — see "Git auth"), the
  orchestrator pushes `v1-delivery` to origin instead, and the user
  reviews/QAs/merges from there.

Provisioning the chosen path is the **one prerequisite** to starting an
autonomous run.

## Stop & escalation conditions

The orchestrator halts the run and pings the human when any of these hit
— it does not push through:

- A plan returns Tier-2 `CHANGES` three times (design churn it can't
  resolve mechanically).
- The Agent-Reviewer inner loop fails to reach `SIGNOFF` after a
  reasonable number of cycles on one plan.
- A `data-safety` finding appears (a change that could drop a returning
  user's persisted data) — always escalates, never auto-resolves.
- A plan needs a decision the specs/BRIEF don't answer (genuine product
  ambiguity).
- The gate cannot be made to pass for reasons outside the plan (toolchain,
  flaky environment).

On stop, the orchestrator records the blocker in `DELIVERY_STATE.md` and
summarizes it for the human — it never fakes progress to keep going.

## Resumability

The run is cross-session. `.planning/DELIVERY_STATE.md` is the single
source of truth for "where are we": per-plan status, the tip SHA of each
completed plan, and any open blocker. A fresh orchestrator session reads
it, re-establishes the build clone at the recorded `v1-delivery` tip, and
continues. The orchestrator updates it after every plan transition.

## V1 acceptance & QA handoff

When `DELIVERY_STATE.md` shows every roadmap plan done, the orchestrator:

1. Runs the full gate once more on the final `v1-delivery` tip.
2. Walks `.planning/V1_ACCEPTANCE.md` — the concrete, user-level pass/fail
   checklist derived from `BRIEF.md`. Any failure is a stop condition.
3. Produces the QA handoff for the human: the bundle (or pushed branch),
   the built preview to click through, the acceptance results, and a
   short "what to try" script aimed at the 3 AM use case.

Only then does the human step in — to QA the real product, then merge
`v1-delivery` → `main`.
---

# Autonomous Delivery — Verified Cowork Facts & Parallelization

The following were confirmed during the first full end-to-end run. Where they
differ from assumptions earlier in this file, **these win**.

## Verified execution facts

1. **The orchestrator drives every spawn.** Cowork subagents cannot spawn
   subagents. The Implementer does NOT spawn its own Agent-Reviewer — it hands
   its status report back to the orchestrator, which spawns a fresh
   Agent-Reviewer, relays any `FINDINGS`, and re-spawns the Implementer. The
   Design-Reviewer is likewise orchestrator-spawned. The inner mechanical loop
   is orchestrator-driven, not Implementer-driven.
2. **All work happens in sandbox-native clones, never the mounted folder.** The
   mounted Windows `.git` corrupts its index under load, and its `node_modules`
   hold Windows binaries the Linux sandbox can't run (the gate would fail on a
   native-module error, not a real one). Clone from origin into `/tmp/<lane>`
   and work there. The mounted folder is only the human's checkout.
3. **Gates run synchronously.** Backgrounded processes (`&`, `nohup`) are killed
   between tool calls. Run `type-check`/`lint`/`test`/`build` in the foreground.
   Once the suite is large it can exceed a single call's time limit — run it in
   file-batched chunks (e.g. `npx vitest run <files...>`), but never background.
4. **Subagent file tools don't reach `/tmp`.** Implementers author and edit code
   via the shell (`cat`/`python3`/`sed`) and read via `cat`/`grep` — not the
   Read/Edit/Write tools, which are scoped to the mounted folder.

## Parallel execution (waves)

Independent plans may run concurrently. A **wave** is a set of plans that
(a) have all dependencies already `done`, and (b) declare **no overlapping
`<files>`**. Any two plans that touch the same file are serialized, never
batched.

Mechanics (all orchestrator-driven):
- **Spawn N Implementers in one turn** (N parallel Agent calls). Each lane gets
  its **own clone** `/tmp/lane-<plan>` and its **own branch**
  `phase-NN/NN-MM-<name>` cut from the current `v1-delivery` tip — parallel work
  cannot share a working tree or the single integration branch. Each lane runs
  its own `npm install` + gate and pushes its branch to origin.
- **Reviews parallelize too.** The orchestrator spawns the Sonnet
  Agent-Reviewers and the Opus Design-Reviewers for different plans
  concurrently; they are read-only and operate in their own lane clones.
- **Integration is always serial.** Once a plan holds `SIGNOFF` + `APPROVE`, the
  orchestrator merges its branch into `v1-delivery` one at a time, in dependency
  order, and re-runs the gate on `v1-delivery` after each merge. A conflict here
  means the file-overlap check was too loose — resolve forward and tighten the
  next wave's batching.
- **Cap concurrency at ~2–3 lanes.** Each lane is a full clone + install + gate;
  the sandbox has finite resources.

Coordination substrate: the per-plan branches (code artifacts) + the
`DELIVERY_STATE.md` ledger are sufficient — **no separate shared memory.** The
ledger records each lane's clone path, branch, and status so a cold session can
resume mid-wave.

Reality for THIS roadmap: the dependency graph allows limited parallelism
(Phase 4 is the main independent lane against Phases 2–3; Phase-5 plans are
sequential). Roadmaps with independent feature areas gain much more.
