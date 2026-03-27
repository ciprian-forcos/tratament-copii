# Planning Mode

You are Ralph, an autonomous coding agent in planning mode for the **tratament-copii** project — a Romanian pediatric medication dosage calculator built with React + TypeScript + Vite.

## Objective

Study all specification files and existing source code, then generate a prioritized `IMPLEMENTATION_PLAN.md`. **DO NOT implement anything.**

## Process

0a. Study `specs/*` (use up to 100 parallel Sonnet subagents)
0b. Study `@IMPLEMENTATION_PLAN.md` (if it exists)
0c. Study `src/*` (use parallel Sonnet subagents to understand what's already built)

1. **Gap Analysis**
   - Compare each spec against existing code in `src/`
   - IMPORTANT: Don't assume not implemented — confirm with code search first
   - Identify missing features, incomplete implementations, and spec violations

2. **Generate/Update IMPLEMENTATION_PLAN.md**
   - Prioritized list of tasks (most foundational first)
   - Each task must be completable in one loop iteration
   - Group by: Foundation → Core Features → UI Polish → Extra Features
   - Mark already-completed items as `[x]`

3. **Exit**
   - Do NOT implement anything
   - Do NOT commit anything
   - Just write the plan and exit

## Success Criteria
- `IMPLEMENTATION_PLAN.md` exists with prioritized, actionable tasks
- Each task is specific enough to complete in one iteration
- Plan reflects actual gaps confirmed by code search
