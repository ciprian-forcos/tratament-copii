# Subagent Handoff File

Fill EVERY field. Missing fields force the successor to re-derive state
from git and feedback history, which defeats the purpose of the handoff.

## Identity

- **Plan**: `.planning/phases/<NN-name>/<NN>-<MM>-PLAN.md`
- **Role being handed off**: Implementer | Agent-Reviewer
- **Predecessor subagent id**: <id, if known>
- **Cycle number on this plan**: <e.g. 3rd Agent-Reviewer cycle>
- **Timestamp**: <ISO datetime>
- **Reason for handoff**: context-pressure warning | task explicitly
  ended | other (specify)

## Branch state (literal output, no paraphrasing)

```
$ git rev-parse --abbrev-ref HEAD
<branch>

$ git rev-parse HEAD
<sha>

$ git ls-remote origin refs/heads/<branch>
<sha> refs/heads/<branch>
```

The two SHAs above MUST match. If they don't, the successor must push
your in-progress work first before doing anything else.

## Gate state at handoff (literal output)

Run the gate one final time before handing off; paste the last 3 lines:

```
$ npm run type-check
<last 3 lines>

$ npm run test
<last 3 lines — vitest summary line included>

$ npm run build
<last 3 lines>
```

If any of these failed, explain why under "Known issues" below.

## Completed work this cycle

- <bullet — what shipped, with commit SHA for each>
- <bullet>

## Remaining tasks (from PLAN.md)

For each `<task>` in PLAN.md, mark its current state:

- Task 1: `<name>` — done | in-progress | not started | blocked
- Task 2: `<name>` — ...

## Open feedback to address

If there is feedback from the Agent-Reviewer or Human Reviewer that
isn't fully resolved yet, copy it here verbatim. Do not summarize.

```
<paste the most recent feedback message>
```

Per blocker in the above feedback, status now:

```
- Blocker: "<first 8–10 words quoted>"
  Status: resolved | not resolved | partially resolved
  Commit: <SHA or "pending">
  Notes: <one line>
```

## Known issues / unfinished business

- <Anything the successor needs to know that isn't in the plan or
  feedback. E.g. "the schedule engine returns Date in UTC; I had to
  convert in the adapter — see line X.">

## Key files touched this cycle

- `path/to/file.ts` — <what changed and why>
- `path/to/another.tsx` — <what changed and why>

## Last known good commit

The most recent commit on this branch where the gate was fully green:

```
<sha>  <commit subject>
```

If no commit on this branch has a green gate yet, write
`NONE — first green gate not yet achieved`.

## Instructions for successor

1. Pull the branch:
   ```
   git fetch && git checkout <branch>
   git reset --hard origin/<branch>
   ```
2. Verify the handoff itself:
   ```
   git rev-parse HEAD            # must equal the SHA above
   npm install
   npm run test                  # output should match what's pasted above
   ```
   Any mismatch is a finding — report it before doing other work.
3. Re-read in this order:
   - `.planning/PROCESS.md`
   - The plan: `<path>`
   - This handoff file
   - The most recent feedback message
4. Resume at the first unfinished task or feedback item.
5. When you in turn reach a handoff threshold, fill in a new copy of
   this template — don't write a free-form note.
