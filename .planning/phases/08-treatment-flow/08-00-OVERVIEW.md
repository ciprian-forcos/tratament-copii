---
phase: v1-phase-08-treatment-flow
type: overview
branch: V1/phase-08-treatment-flow
---

<objective>
Turn the one-shot plan card into an ongoing fever episode: start once,
then wait or give the next dose from Home without repeating the wizard.
</objective>

<branch>
Use `V1/phase-08-treatment-flow` (based on Phase 07).
</branch>

<success_criteria>
- First visit still uses Home → temperature → history → plan → record.
- A recorded (or waited) last dose within 24h continues to the plan card.
- PlanCard uses dose history as source of truth, not only Step 2 state.
- Deferred plans can go Home via `Voi aștepta` and keep the countdown.
- After 24h without a dose, Home starts a new episode.
- No localStorage key or share-URL format changes.
</success_criteria>
