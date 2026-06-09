# Phase 6 — V1 Hardening (overview & wave map)

Supersedes the loose `PHASE_6_HARDENING_PLAN.md` handed off earlier. The six
per-plan files in this folder (`06-01`..`06-06`) are the executable units; this
file is the orchestrator's map.

**Base branch:** `main` (the deployed V1).

**Terminology (enforce in every plan):** the app computes the **treatment plan**
(which antipyretic, when). "Dosage" = the separate mg/kg calc in
`doseCalculation.ts`. Do not conflate them in code or copy.

**Canonical spacing (user = medical authority):** Nurofen 8h, Panadol 8h,
**minimum 4h between a Nurofen dose and a Panadol dose**. `scheduleRules.ts` is
the single source of truth; older 2h/3h/6h values are bugs.

## Waves (file-disjoint)

- **Wave A (parallel):** 06-01, 06-05, 06-06
- **Wave B (parallel):** 06-02, 06-04
- **Wave C (serial):** 06-03 (same file as 06-02; depends on 06-01 + 06-02)

## Bug → plan map (12 QA bugs)

| Bug | Plan |
|-----|------|
| #7 treatment-plan rule correctness | 06-01 |
| #11 Virodep in Step 2 / #9 title copy | 06-02 |
| #10 last-dose multi-day datetime | 06-03 |
| #2 phantom countdown / #3 timeline anchor / #4a temp+age+child controls / #5 copy | 06-04 |
| #4b fake status icons / #12 112 banner / #8 BSA line / #6 add-medicine | 06-05 |
| #1 PWA add-to-home-screen | 06-06 |

## Corrections made vs the loose plan (verified against the checkout 2026-06-07)

The loose plan referenced several symbols that do **not** exist in the deployed
code. The per-plan files were corrected:

1. **No `MIN_CROSS_DRUG_GAP_MS` constant and no `scheduleAdapter.ts`.** The real
   spacing is two inline `2 * 3600_000` literals at `dosePlan.ts:62` and `:66`,
   and `dosePlan.ts` never imports `scheduleRules.ts`. 06-01 is therefore
   "wire the active path to the rules data," not "remove a constant."
2. **No `useNightTimeline.ts`.** The timeline math is inline in `HomeB.tsx`
   (`toPct` ~line 38, `mk` ~line 193). 06-04 edits `HomeB.tsx`.
3. **No BSA line and no `ChildrenScreen.tsx`** on active surfaces (Phase 4 was
   never built). `height` exists only in `types.ts` and the legacy `CopiiTab`.
   06-05 makes #8 a locate-then-triage item.
4. **`+ adaugă` in `ChildEditor.tsx:142` is add-child, not add-medicine.** The
   only add-medicine affordance is in the legacy `MedicamenteTab`
   (reference-only). 06-05 makes #6 a locate-then-triage item; legacy tabs must
   not be deleted (PROCESS.md).

## ⚠️ Open flag for the orchestrator / human

The mounted checkout's active dose path (`dosePlan.ts`) is the **naive prototype**
(hardcoded 2h alternation, no schedule-engine wiring) and there is **no children
screen**. `DELIVERY_STATE.md` shows the V1 autonomous run with Phases 2–5 still
`pending`/`implemented-needs-Tier-2`. This contradicts "V1 phases 1–5 shipped."
Before running Phase 6, confirm what is actually on `main`: Phase 6's plans were
written against the code currently in the working folder. If `main` differs,
re-ground the affected plans (esp. 06-01, 06-03, 06-05) after cloning.
