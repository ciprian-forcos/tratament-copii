---
phase: v1-phase-06-hardening
plan: 06-02
type: execute
branch: V1/phase-06-hardening
---

<objective>
Remove misleading home-screen signals: no phantom countdown before treatment
exists, timeline should frame `now`, controls should be separated, fake phone
status icons should be removed, and the temperature control should say
`Temperatura`.
</objective>

<execution_context>
@.planning/PROCESS.md
@.planning/TEST_CONVENTIONS.md
</execution_context>

<context>
@knowledge/bugs/phantom-countdown-before-treatment.md
@knowledge/bugs/timeline-now-marker-anchoring.md
@knowledge/bugs/home-controls-and-fake-status-icons.md
@knowledge/bugs/temperature-copy.md
@knowledge/ui/home-screen.md
@src/components/design/HomeB.tsx
@src/components/design/ChildPill.tsx
@src/components/design/StatusBar.tsx
@src/components/design/useNightTimeline.ts
</context>

<tdd_rule>
For every behavior-changing task below, first commit a failing focused test as
`[test] ...`, then commit the minimum implementation as `[feat] ...`. Do not
combine test and implementation commits.
</tdd_rule>

<tasks>

<task type="auto">
  <name>Task 1: Stop rendering a fake next dose</name>
  <files>
  src/components/design/HomeB.tsx,
  src/components/design/HomeB.test.tsx
  </files>
  <action>
  Delete the `now + 2h` / `Panadol` fallback. If `nextDose` is missing and
  there is no recorded treatment-derived next dose, show no countdown, no next
  marker, and no "Urmatoarea doza" CTA time.
  </action>
  <verify>
  Component test proves an empty/no-treatment state has no countdown text and
  no fake Panadol marker.
  </verify>
  <done>
  Home does not imply a plan exists before treatment starts.
  </done>
</task>

<task type="auto">
  <name>Task 2: Anchor the timeline around now</name>
  <files>
  src/components/design/HomeB.tsx,
  src/components/design/useNightTimeline.ts,
  src/components/design/HomeB.test.tsx
  </files>
  <action>
  Adjust the strip window so `now` is visually centered when possible, with
  recent and pending treatment around it. Keep the existing night timeline
  behavior where it is still useful, but do not pin the current marker to the
  far right.
  </action>
  <verify>
  Add a focused test around the anchor helper or rendered marker position.
  </verify>
  <done>
  The `acum` marker is not at an edge in the normal home state.
  </done>
</task>

<task type="auto">
  <name>Task 3: Separate child, age/profile, and temperature controls</name>
  <files>
  src/components/design/HomeB.tsx,
  src/components/design/ChildPill.tsx,
  src/components/design/HomeB.test.tsx,
  src/components/design/ChildPill.test.tsx
  </files>
  <action>
  Split the combined child pill into distinct tappable controls:
  - child identity/menu entry,
  - age/profile edit entry,
  - temperature edit entry.

  Keep the interaction minimal and preserve the existing editors. Do not add a
  new profile-management surface.
  </action>
  <verify>
  Component tests can find the controls separately and open the expected
  existing sheets.
  </verify>
  <done>
  Child identity, profile details, and temperature editing are visibly distinct.
  </done>
</task>

<task type="auto">
  <name>Task 4: Remove fake status icons and fix temperature copy</name>
  <files>
  src/components/design/StatusBar.tsx,
  src/components/design/HomeB.tsx,
  src/components/design/StatusBar.test.tsx,
  src/components/design/HomeB.test.tsx
  </files>
  <action>
  Keep the time display if it is useful, but remove fake signal/battery icons.
  Change the temperature control label from `Masoara din nou` to `Temperatura`.
  </action>
  <verify>
  Tests assert fake icon labels/markup are absent and `Temperatura` opens the
  temperature picker.
  </verify>
  <done>
  Home no longer presents decorative device status or stale copy.
  </done>
</task>

</tasks>

<verification>
- [ ] `npm run test -- HomeB`
- [ ] `npm run test -- ChildPill`
- [ ] `npm run test -- StatusBar`
- [ ] `npm run type-check`
- [ ] `npm run build`
</verification>

<success_criteria>
The home screen only shows real treatment state, centers the current moment in
the timeline, and exposes separated controls with requested copy.
</success_criteria>

<output>
After merge, create
`.planning/phases/06-hardening/06-02-home-screen-hardening-SUMMARY.md`.
</output>
