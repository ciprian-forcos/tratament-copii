---
phase: v1-phase-06-hardening
plan: 06-03
type: execute
branch: V1/phase-06-hardening
---

<objective>
Remove two unsupported UI details: BSA/estimated-height display in the children
menu and the unsupported `112 / pediatrician` banner in the plan card.
</objective>

<execution_context>
@.planning/PROCESS.md
@.planning/TEST_CONVENTIONS.md
</execution_context>

<context>
@knowledge/bugs/children-bsa-display.md
@knowledge/bugs/unsupported-emergency-banner.md
@knowledge/ui/children-screen.md
@knowledge/ui/plan-card.md
@src/components/design/ChildrenScreen.tsx
@src/components/design/ChildrenScreen.test.tsx
@src/components/design/PlanCard.tsx
@src/components/design/PlanCard.test.tsx
</context>

<tdd_rule>
For every behavior-changing task below, first commit a failing focused test as
`[test] ...`, then commit the minimum implementation as `[feat] ...`. Do not
combine test and implementation commits.
</tdd_rule>

<tasks>

<task type="auto">
  <name>Task 1: Remove BSA from the children menu</name>
  <files>
  src/components/design/ChildrenScreen.tsx,
  src/components/design/ChildrenScreen.test.tsx
  </files>
  <action>
  Delete the visible BSA/estimated-height row from `ChildrenScreen`. Do not
  delete `calculateBSA` or `estimateHeight` unless they become unused after
  normal import cleanup.
  </action>
  <verify>
  Update component tests to assert `BSA` and estimated-height text are absent.
  </verify>
  <done>
  Children management shows child basics and medicines without BSA details.
  </done>
</task>

<task type="auto">
  <name>Task 2: Remove unsupported emergency banner</name>
  <files>
  src/components/design/PlanCard.tsx,
  src/components/design/PlanCard.test.tsx
  </files>
  <action>
  Delete the `112 / pediatrician` banner. Do not replace it with new medical
  advice unless the product/medical graph already supports that text.
  </action>
  <verify>
  Update component tests to assert the banner text is absent and the primary
  dose action still renders.
  </verify>
  <done>
  Plan card keeps the dosing action without unsupported safety copy.
  </done>
</task>

</tasks>

<verification>
- [ ] `npm run test -- ChildrenScreen`
- [ ] `npm run test -- PlanCard`
- [ ] `npm run type-check`
- [ ] `npm run build`
</verification>

<success_criteria>
BSA/height and unsupported emergency banner copy are absent from rendered UI
and tests guard against their return.
</success_criteria>

<output>
After merge, create
`.planning/phases/06-hardening/06-03-ui-cleanup-SUMMARY.md`.
</output>
