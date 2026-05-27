# Subagent + Review Protocol

This file is the contract between the user (reviewer) and the subagent
(implementer). Every PLAN.md links here. Subagents follow this verbatim.

## Roles

- **Reviewer**: the user, via Claude. Reviews each PR before merge. Has the
  final say on merge.
- **Implementer**: a subagent spawned per plan. One subagent per plan.
  Starts cold, reads the PLAN.md, executes, opens PR.

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
   import error.
4. **Implement** the minimum code that makes the new tests pass. Commit:
   `[feat] implement <unit>`.
5. **Refactor** if needed while keeping tests green. Commit: `[refactor] ...`.
6. **Run the full gate** (see below). All checks must pass before opening the
   PR. If any check fails, fix and recommit — do **not** open the PR.
7. **Push** the branch and **open a PR** against `main` using the template
   below.
8. **Stop** and wait for review.

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

## PR template

The PR body must contain:

```markdown
## Plan
`.planning/phases/{NN-name}/{NN}-{MM}-PLAN.md`

## Summary
[1–3 bullets describing what changed and why.]

## Files changed
[Bulleted list of files touched, grouped by created / modified / deleted.]

## Tests
- New tests: [path → what they cover]
- Total test count: X passing, 0 failing
- Coverage of the new unit: [briefly: what's covered, what isn't]

## Gate
- [x] `npm run type-check` passes
- [x] `npm run lint` passes
- [x] `npm run test` passes (X tests)
- [x] `npm run build` passes
- [x] Manual smoke check: [what you tested in the running app]

## Deviations from the plan
[Anything you did that the plan didn't say to do, with rationale. If none, say
"None".]

## Open questions for the reviewer
[Anything the reviewer needs to decide, or "None".]
```

## Review process (reviewer side)

1. Read the PR description.
2. Read the diff. Spot-check tests for actually testing the right thing.
3. Run locally:
   ```
   git fetch && git checkout <branch> && npm install && npm run test && npm run dev
   ```
4. Walk through the new behavior in the running app.
5. Leave comments on the PR:
   - **Blocker** comments must be resolved before merge.
   - **Nit** comments are optional.
6. Approve or request changes.

## Addressing review comments (subagent side)

- Push **new commits**. Do **not** amend, do **not** force-push. The review
  history must be readable.
- Re-run the full gate after each round of changes.
- Reply on each comment thread explaining what changed.
- When all blocker comments are resolved, ping the reviewer.

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
- No touching `package.json` dependencies that aren't in the plan's
  `<files>` list, except `devDependencies` explicitly named by the plan.
- No changes to existing localStorage key names
  (`tratament-copii-children`, `tratament-copii-active-child`,
  `tratament-copii-medications`). New keys must be additive.
- No deletion of the old tab components (`MedicamenteTab`, `CopiiTab`,
  `ProgramTab`) in V1 — they are reference material until V1 fully replaces
  their functionality.
