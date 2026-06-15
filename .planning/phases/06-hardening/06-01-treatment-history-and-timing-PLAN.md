---
phase: v1-phase-06-hardening
plan: 06-01
type: execute
branch: V1/phase-06-hardening
---

<objective>
Make Step 2 and the treatment planner follow one timing policy:
Nurofen/ibuprofen repeats at 8h, Panadol/paracetamol repeats at 8h, and the
project cross-drug floor is 4h. Step 2 must ask `Ai mai administrat altceva?`,
accept a real previous dose datetime, and offer only antipyretic choices.
</objective>

<execution_context>
@.planning/PROCESS.md
@.planning/TEST_CONVENTIONS.md
</execution_context>

<context>
@knowledge/bugs/treatment-timing-policy-mismatch.md
@knowledge/bugs/step2-title-copy.md
@knowledge/bugs/step2-real-datetime-entry.md
@knowledge/bugs/step2-virodep-choice.md
@knowledge/medical/treatment-plan-rules.md
@knowledge/ui/step2-treatment-history.md
@knowledge/implementation/schedule-adapter-and-dose-plan.md
@src/components/design/Step2.tsx
@src/components/design/dosePlan.ts
@src/components/design/scheduleAdapter.ts
@src/data/scheduleRules.ts
</context>

<tdd_rule>
For every behavior-changing task below, first commit a failing focused test as
`[test] ...`, then commit the minimum implementation as `[feat] ...`. Do not
combine test and implementation commits.
</tdd_rule>

<tasks>

<task type="auto">
  <name>Task 1: Lock the timing policy with tests</name>
  <files>
  src/components/design/dosePlan.test.ts,
  src/components/design/scheduleAdapter.test.ts
  </files>
  <action>
  Add focused tests that fail on the current policy drift:
  - Panadol repeat interval is 8h, not 6h.
  - Nurofen repeat interval remains 8h.
  - Cross-drug alternation cannot plan an immediate dose before the 4h floor.
  - `buildPlan` accepts a real previous-dose datetime, not same-day `HH:MM`
    guessing.
  </action>
  <verify>
  Targeted timing tests fail before implementation and pass after.
  </verify>
  <done>
  Timing rules are executable and match `knowledge/medical/treatment-plan-rules.md`.
  </done>
</task>

<task type="auto">
  <name>Task 2: Update Step 2 UI and value shape</name>
  <files>
  src/components/design/Step2.tsx,
  src/components/design/Step2.test.tsx,
  src/components/design/FlowProtoB.tsx
  </files>
  <action>
  Use native date/time input, not custom chips. Store the selected previous dose
  as one local datetime value that downstream code can turn into a `Date`.

  Required UI behavior:
  - Title is exactly `Ai mai administrat altceva?`.
  - Last-dose choices include fever-treatment antipyretics only.
  - Virodep is absent.
  - Continue is disabled until medication and datetime are both present when
    `kind === 'last'`.
  </action>
  <verify>
  `npm run test -- Step2` passes.
  </verify>
  <done>
  Step 2 captures the actual previous administration datetime.
  </done>
</task>

<task type="auto">
  <name>Task 3: Wire datetime through plan generation</name>
  <files>
  src/components/design/FlowProtoB.tsx,
  src/components/design/dosePlan.ts,
  src/components/design/PlanCard.tsx
  </files>
  <action>
  Replace `lastAtHHMM` plumbing with an absolute previous-dose datetime. Keep
  the fallback for first-treatment unchanged. Do not infer "yesterday" from a
  clock-only value anymore; the parent supplies the date.
  </action>
  <verify>
  `dosePlan` tests cover a last dose from a previous calendar day.
  </verify>
  <done>
  Planning uses the entered datetime end to end.
  </done>
</task>

<task type="auto">
  <name>Task 4: Update medicine timing constants and notes</name>
  <files>
  src/data/scheduleRules.ts,
  src/data/medications.ts
  </files>
  <action>
  Change Panadol recurrence to 8h and update default medicine notes so the UI
  does not still say 6h or 2h.
  </action>
  <verify>
  Search for stale timing copy: `rg "6 ore|2h|min 2" src/data src/components`.
  </verify>
  <done>
  Rule code and displayed notes agree.
  </done>
</task>

</tasks>

<verification>
- [ ] `npm run test -- Step2`
- [ ] `npm run test -- dosePlan`
- [ ] `npm run test -- scheduleAdapter`
- [ ] `npm run type-check`
- [ ] `npm run build`
</verification>

<success_criteria>
All timing behavior uses the 8h/8h/4h project rule, Step 2 records real
datetime history, and Virodep is no longer offered as a fever-treatment choice.
</success_criteria>

<output>
After merge, create
`.planning/phases/06-hardening/06-01-treatment-history-and-timing-SUMMARY.md`.
</output>
