---
phase: v1-phase-06-hardening
type: overview
branch: V1/phase-06-hardening
---

<objective>
Plan V1 Phase 06 hardening as four grouped implementation units mapped to the
12 imported QA bug nodes.

Product decision: restore the legacy `MedicamenteTab` path and ensure
antipyretics are available there. Do not build a second custom medicine editor.
</objective>

<execution_context>
@.planning/PROCESS.md
@.planning/TEST_CONVENTIONS.md
@knowledge/process/v1-phase-06-hardening.md
@knowledge/process/phase6-hardening-bugs.md
</execution_context>

<branch>
Use `V1/phase-06-hardening` for the phase branch. Task branches may live under
that prefix if the loop needs smaller review slices.
</branch>

<knowledge_graph>
Use `knowledge/ui/interaction-graph.md` as the planning map. Phase 06
implementation must keep page, button/control, functionality, source-function,
bug, and feature links current.
</knowledge_graph>

<execution_loop>
Use `knowledge/process/phase-06-fresh-context-execution.md` for fresh-context
implementer and reviewer spawning. Use
`knowledge/process/phase-06-parallel-execution-map.md` for parallel lane
ownership and sequencing.
</execution_loop>

<plans>

<plan id="06-01" file="06-01-treatment-history-and-timing-PLAN.md">
Treatment history and timing.

Bugs:
- [Treatment timing policy mismatch](../../../knowledge/bugs/treatment-timing-policy-mismatch.md)
- [Step 2 title copy](../../../knowledge/bugs/step2-title-copy.md)
- [Step 2 real datetime entry](../../../knowledge/bugs/step2-real-datetime-entry.md)
- [Step 2 Virodep choice](../../../knowledge/bugs/step2-virodep-choice.md)
</plan>

<plan id="06-02" file="06-02-home-screen-hardening-PLAN.md">
Home screen hardening.

Bugs:
- [Phantom countdown before treatment](../../../knowledge/bugs/phantom-countdown-before-treatment.md)
- [Timeline now marker anchoring](../../../knowledge/bugs/timeline-now-marker-anchoring.md)
- [Home controls and fake status icons](../../../knowledge/bugs/home-controls-and-fake-status-icons.md)
- [Temperature copy](../../../knowledge/bugs/temperature-copy.md)
</plan>

<plan id="06-03" file="06-03-ui-cleanup-PLAN.md">
UI cleanup.

Bugs:
- [Children BSA display](../../../knowledge/bugs/children-bsa-display.md)
- [Unsupported emergency banner](../../../knowledge/bugs/unsupported-emergency-banner.md)
</plan>

<plan id="06-04" file="06-04-install-and-medicines-PLAN.md">
Install and medicines.

Bugs:
- [Missing add-to-home-screen affordance](../../../knowledge/bugs/missing-add-to-home-screen-affordance.md)
- [Medicine add flow](../../../knowledge/bugs/medicine-add-flow.md)
</plan>

</plans>

<verification>
- [ ] Each implementation plan maps back to its bug nodes.
- [ ] `knowledge/process/v1-phase-06-hardening.md` links this overview and all
      four plans.
- [ ] `knowledge/log.md` records this planning update.
- [ ] No `06-*-SUMMARY.md` files exist until implementation is complete.
</verification>

<success_criteria>
V1 Phase 06 can be implemented from four grouped plans without losing any
imported QA bug, timing rule, or medicine product decision.
</success_criteria>

<output>
After each grouped plan is implemented, create the matching
`.planning/phases/06-hardening/06-0x-*-SUMMARY.md`.
</output>
