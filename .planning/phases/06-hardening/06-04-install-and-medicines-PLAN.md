---
phase: v1-phase-06-hardening
plan: 06-04
type: execute
branch: V1/phase-06-hardening
---

<objective>
Add a small add-to-home-screen affordance and restore the existing medicine add
flow through `MedicamenteTab`. Do not build a new custom medicine editor.
</objective>

<execution_context>
@.planning/PROCESS.md
@.planning/TEST_CONVENTIONS.md
</execution_context>

<context>
@knowledge/bugs/missing-add-to-home-screen-affordance.md
@knowledge/bugs/medicine-add-flow.md
@knowledge/product/v1-scope.md
@knowledge/sources/tooling-and-deploy.md
@knowledge/implementation/app-state-local-storage.md
@src/App.tsx
@src/components/design/HomeB.tsx
@src/components/design/ChildrenScreen.tsx
@src/components/design/FlowProtoB.tsx
@src/components/MedicamenteTab.tsx
@src/data/medications.ts
@manifest.json
</context>

<tdd_rule>
For every behavior-changing task below, first commit a failing focused test as
`[test] ...`, then commit the minimum implementation as `[feat] ...`. Do not
combine test and implementation commits.
</tdd_rule>

<tasks>

<task type="auto">
  <name>Task 1: Add the PWA install affordance</name>
  <files>
  src/components/design/HomeB.tsx,
  src/components/design/HomeB.test.tsx,
  manifest.json
  </files>
  <action>
  Add one visible install entry in the home flow. Use the browser
  `beforeinstallprompt` event when available and hide/disable the prompt when
  already installed. On unsupported browsers, show a short manual install
  affordance only; do not add accounts, push notifications, or cloud scope.
  </action>
  <verify>
  Component tests cover supported, unsupported, and installed states with a
  mocked `beforeinstallprompt`.
  </verify>
  <done>
  Parent has a visible path to install/open the PWA from Home.
  </done>
</task>

<task type="auto">
  <name>Task 2: Restore the legacy medicines path</name>
  <files>
  src/components/design/FlowProtoB.tsx,
  src/components/design/ChildrenScreen.tsx,
  src/components/design/ChildrenScreen.test.tsx,
  src/components/MedicamenteTab.tsx
  </files>
  <action>
  Add a `Medicamente` entry from the children/menu area that routes to the
  existing `MedicamenteTab`. Keep its existing add/edit/delete behavior instead
  of recreating the editor in design components.
  </action>
  <verify>
  Component test opens the medicines route and finds `Adauga medicament`.
  </verify>
  <done>
  The app has one reachable medicine add flow.
  </done>
</task>

<task type="auto">
  <name>Task 3: Persist medicines through the existing key</name>
  <files>
  src/components/design/FlowProtoB.tsx,
  src/components/design/share/ShareSheet.tsx,
  src/components/design/share/ImportGate.tsx,
  src/components/MedicamenteTab.tsx
  </files>
  <action>
  Use `tratament-copii-medications` as the single medicine storage key. Seed
  from `DEFAULT_MEDICATIONS` when the key is absent. Make sure restored
  medicine edits still participate in share/import where custom medicines are
  already supported.
  </action>
  <verify>
  Tests prove an added medicine is saved and a reload reads it back.
  </verify>
  <done>
  Medicine state is not split between legacy and design flows.
  </done>
</task>

<task type="auto">
  <name>Task 4: Verify antipyretics are available</name>
  <files>
  src/data/medications.ts,
  src/components/MedicamenteTab.tsx,
  src/components/design/ChildrenScreen.tsx
  </files>
  <action>
  Confirm the restored medicines path includes default antipyretics used by the
  fever plan: Nurofen, Panadol, and the existing stronger antipyretic entries.
  The parent should not need to create these from scratch.
  </action>
  <verify>
  Tests or assertions cover the default medicine list and visible medicine tab
  contents.
  </verify>
  <done>
  Antipyretics are present in the restored medicines path.
  </done>
</task>

</tasks>

<verification>
- [ ] `npm run test -- HomeB`
- [ ] `npm run test -- ChildrenScreen`
- [ ] `npm run test -- Medicamente`
- [ ] `npm run type-check`
- [ ] `npm run build`
</verification>

<success_criteria>
Home exposes install, children/menu exposes medicines, `MedicamenteTab` remains
the only medicine editor, and default antipyretics are available there.
</success_criteria>

<output>
After merge, create
`.planning/phases/06-hardening/06-04-install-and-medicines-SUMMARY.md`.
</output>
