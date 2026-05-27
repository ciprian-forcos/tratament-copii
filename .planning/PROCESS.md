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
emitting `FINDINGS` or `SIGNOFF`. The successor finishes the
verification.

### Implementer Subagents
On the first context-pressure warning from the harness during a plan, the
Implementer must finish its current commit (do not leave the tree dirty),
push, then create a handoff file and spawn a successor Implementer
subagent. The successor reads the handoff plus the PLAN.md and resumes.

### Context Compaction
If the harness supports compaction (e.g. summarization), the agent may
use it once per role per plan. If it doesn't help, hand off. Do not chain
multiple compactions — quality degrades faster than the savings.

### Handoff Procedure
1. Save current tree state: commit any in-progress work to the branch
   with a `[wip]` prefix (rebased away before opening the PR).
2. Push the branch. Verify with `git ls-remote`.
3. Create a handoff file under `.planning/handoffs/` using
   `HANDOFF_TEMPLATE.md` as the template. Fill EVERY field; missing
   fields force the successor to re-derive state from git and the
   review history.
4. The successor subagent is spawned with:
   - The path to the handoff file
   - The PLAN.md path
   - The PROCESS.md path
   - The most recent feedback message (Agent-Reviewer findings or
     Human-Reviewer comments) if any.
5. The successor's first action is to verify the handoff: pull the
   branch, run the gate once, compare its output to what the handoff
   claims. Any mismatch is reported back as if it were a regular
   `FINDINGS` item.

### When NOT to hand off
- Mid-commit. Finish the commit first.
- Mid-`git push`. Wait for it to complete.
- When the only remaining work is a status report. Just finish the
  report and emit it. A handoff to write a status report is more
  expensive than writing the report.
