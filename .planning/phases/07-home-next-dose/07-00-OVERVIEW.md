---
phase: v1-phase-07-home-next-dose
type: overview
branch: V1/phase-07-home-next-dose
---

<objective>
After Phase 06 removed the fake Home countdown, Home never received a real
next dose. Wire the next planned dose from recorded treatment history so the
3 AM parent sees when the next medicine is due.
</objective>

<execution_context>
@.planning/PROCESS.md
@.planning/TEST_CONVENTIONS.md
@knowledge/medical/treatment-plan-rules.md
@knowledge/ui/home-screen.md
@knowledge/functionality/timeline-and-next-dose-display.md
</execution_context>

<branch>
Use `V1/phase-07-home-next-dose`.
</branch>

<plans>

<plan id="07-01" file="07-01-PLAN.md">
Derive Home next-dose from the latest administered dose using the existing
`buildPlan()` alternation and 4h cross-drug floor.
</plan>

</plans>

<success_criteria>
- No countdown before any dose is recorded for the active child.
- After "Am dat doza", Home shows the real next medicine and time.
- Timing stays the Phase 06 rule: 8h same-drug, 4h Nurofen↔Panadol.
- No localStorage key or share-URL format changes.
</success_criteria>
