# 03-01 FINDINGS — schedule engine adapter proposal

Research-only. Decision recorded at the bottom (made by the Opus
design/orchestrator tier in autonomous mode, standing in for the human).

## 1. Engine summary

`src/utils/scheduleEngine.ts` exports one function:

```ts
generateSchedule(
  startTime: Date,
  rules: ScheduleRule[],
  enabledMedicationIds: string[],
  windowHours = 24,
): ScheduleEntry[]            // { medicationId: string; scheduledAt: Date }[]
```

It is a **forward projection** from `startTime`: `every_n_hours` repeats from
startTime; `once_per_day` emits one at startTime; `times_per_day` spreads N
evenly across the window; `after_medication` emits `hoursAfter` after each
*projected* time of the referenced med (second pass). Output is sorted Dates.

## 2. Inputs the engine needs
- `startTime: Date` — the anchor. It has **no concept of administered history**.
- `rules: ScheduleRule[]` — from `defaultScheduleRules`.
- `enabledMedicationIds: string[]`.

## 3. Outputs
- `ScheduleEntry[]` = `{ medicationId, scheduledAt: Date }`, sorted ascending.
  Returns **Date** objects (not ISO strings). No tz/DST handling — uses local
  `Date` arithmetic in ms (DST transitions could shift a slot by ±1h; out of
  scope for V1, noted as risk).

## 4. The mismatch that matters
The engine projects from a `startTime`; `buildPlan` needs **"next eligible
dose given what was actually administered."** `AdministeredDose[]` is never an
engine input. So the adapter must read the actual last-administered time
(from `doseStore`) and use it as the engine's `startTime` for the relevant
medication — OR compute the interval directly from the rule. Both give the
same number for `every_n_hours`; using the engine keeps the interval source
single (the rules), so we route through it.

Also: design-B's `buildPlan` models simple **2h ibuprofen↔paracetamol
alternation**, while the data rules encode **per-drug safe ceilings**
(nurofen 8h, panadol 6h). These are not contradictory: 2h is the *minimum
spacing between the two different drugs*; 8h/6h are *how soon the SAME drug
may repeat*. V1 must honor both.

## 5. Adapter API proposal
A small pure module `src/components/design/scheduleAdapter.ts`:

```ts
import { generateSchedule } from '../../utils/scheduleEngine'
import { defaultScheduleRules } from '../../data/scheduleRules'

/** Earliest safe time the SAME medication may be given again, from the
 *  engine's per-med interval rule. null if the med has no recurring rule. */
export function earliestRepeat(args: {
  medicationId: string
  lastAdministeredAt: Date
  now: Date
}): Date | null
// impl: generateSchedule(lastAdministeredAt, rules, [medicationId])
//       → first entry with scheduledAt > lastAdministeredAt (i.e. + interval);
//       return max(that, args.now) or null if no entry.
```

`buildPlan` consumes it like this (alternation + the 2h floor STAY in
`dosePlan.ts` — they are cross-drug policy, not per-med rules):

```
nextDrug = other of {nurofen, panadol}
floor    = lastDoseAt + 2h                         // min spacing (policy)
ceiling  = earliestRepeat(nextDrug, lastNextDrugAdministeredAt, now)
                                                   // safety ceiling (engine)
nextWhen = max(now, floor, ceiling ?? 0)
```

`lastDoseAt` and `lastNextDrugAdministeredAt` come from `doseStore.listFor`.

## 6. What changes in buildPlan()
- Delete the `+2 * 3600_000` hardcodes (both "now" and "next").
- Keep: which med is "now"/"next" (alternation), the 2h spacing floor.
- Add: per-drug ceiling via `earliestRepeat`, and read real last-administered
  times from `doseStore` instead of only the `lastAtHHMM` text field.
- `buildPlan` signature gains an optional injected dose source for testability
  (default: `doseStore`), so tests pass fixtures without touching localStorage.

## 7. Engine changes needed? — NO
The engine is sufficient as-is for V1 via the adapter. **Phase 3 stays 2
plans** (no `reshape-engine`). We deliberately do NOT move alternation into
the engine: it's a 2-drug panic policy, the rules model is more general, and
conflating them would bloat both.

## 8. Test strategy
- `scheduleAdapter.test.ts`: earliestRepeat for nurofen (8h) and panadol (6h);
  returns >now when interval already elapsed; null for a med with no recurring
  rule; boundary at exactly the interval.
- `dosePlan.test.ts`: first treatment → Nurofen now, Panadol at +2h floor;
  last=Nurofen given 30m ago → Panadol now is held to the 2h floor; last dose
  long ago → ceiling (6h/8h) dominates; alternation correctness.
- Fake timers for `now`; inject a fake dose source.

## 9. Risks
- DST: ms arithmetic can shift a slot ±1h across a transition. Accept for V1.
- A med missing from rules → `earliestRepeat` returns null → policy floor
  governs. Safe default.
- Empty administered history → first-treatment path (now / now+2h). Safe.

## Decision
**approve-as-proposed.** Adapter shape `earliestRepeat(...)` is correct and
honest to the engine's real behavior; alternation + 2h floor stay in
`dosePlan.ts`; engine needs no changes; Phase 3 remains 2 plans. 03-02 may be
implemented against this.
