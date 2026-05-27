# Roadmap: Plan tratament febră — V1

## Overview

V1 ships the design B GUI on top of real persistence. Six phases: bring the
design baseline into git + add a test runner, persist administered doses, wire
the night timeline to those records, route the dose plan through the real
schedule engine, surface a children-management screen behind the ≡ menu, and
add Tier-1 share-via-URL. Each phase is one branch + one PR + one review gate.

The unit of work is a **plan** (atomic, 2–3 tasks, TDD). Each plan is
self-contained enough to hand to a fresh subagent.

## Phases

- [ ] **Phase 0: Baseline** — commit design B + install Vitest + RTL + smoke test
- [ ] **Phase 1: Dose records** — persist "Am dat doza" to localStorage
- [ ] **Phase 2: Night timeline** — HomeB reads from real records
- [ ] **Phase 3: Schedule engine** — `buildPlan()` uses `scheduleEngine.ts`
- [ ] **Phase 4: Children screen** — ≡ menu opens management view
- [ ] **Phase 5: Share Tier 1** — URL-encoded state, per-child or whole

## Phase Details

### Phase 0: Baseline
**Goal**: Commit the design B implementation, add a test runner, and document
the subagent + review protocol.
**Depends on**: Nothing
**Plans**: 2

Plans:
- [ ] 00-01: Commit design B baseline to a feature branch + open PR
- [ ] 00-02: Install Vitest + React Testing Library, add smoke test, document conventions

### Phase 1: Dose records
**Goal**: Tapping "Am dat doza" creates an `AdministeredDose` record in
localStorage. Records are queryable per-child + per-day.
**Depends on**: Phase 0
**Plans**: 1

Plans:
- [ ] 01-01: Dose record store (tests-first) + wire PlanCard

### Phase 2: Night timeline
**Goal**: `HomeB` reads administered doses from the new store and renders them
on the 12-hour strip. The `defaultTimeline()` stub is removed.
**Depends on**: Phase 1
**Plans**: 1

Plans:
- [ ] 02-01: Timeline hook + render real records on HomeB

### Phase 3: Schedule engine
**Goal**: `buildPlan()` in `dosePlan.ts` uses `src/utils/scheduleEngine.ts` to
compute the next dose timing instead of hardcoding `+2h`. Honors min-spacing
rules and per-medication intervals.
**Depends on**: Phase 1 (needs real "last dose" data)
**Plans**: 2

Plans:
- [ ] 03-01: Research scheduleEngine API surface, propose adapter
- [ ] 03-02: Implement adapter, replace hardcoded `+2h` in `buildPlan()`

### Phase 4: Children screen
**Goal**: Tapping ≡ on HomeB opens a calm-mode children management screen that
lists all children, lets the parent add/edit/delete, and links to the existing
`ChildEditor` bottom sheet. The legacy `CopiiTab` content is surfaced here.
**Depends on**: Phase 0
**Plans**: 1

Plans:
- [ ] 04-01: Children screen + wire ≡ menu

### Phase 5: Share Tier 1
**Goal**: Parent A taps "Partajează" in the children screen, picks per-child or
"toată aplicația", gets a link. Parent B opens the link, sees a confirm-merge
sheet, taps Importă. State is encoded in the URL (no backend). Panic-mode
setting (V2) is explicitly excluded from share state.
**Depends on**: Phase 4
**Plans**: 3

Plans:
- [ ] 05-01: Share-state encode/decode library (tests-first)
- [ ] 05-02: Share UI in children screen (per-child + whole-state checkbox)
- [ ] 05-03: Import flow on receiving device (confirm + merge)

## Progress

| Phase | Plans Complete | Status      | Completed |
|-------|----------------|-------------|-----------|
| 0. Baseline           | 0/2 | Not started | - |
| 1. Dose records       | 0/1 | Not started | - |
| 2. Night timeline     | 0/1 | Not started | - |
| 3. Schedule engine    | 0/2 | Not started | - |
| 4. Children screen    | 0/1 | Not started | - |
| 5. Share Tier 1       | 0/3 | Not started | - |

## V2 Backlog (not planned, just remembered)

- **Panic mode**: manual toggle + auto-on after 20:00 device time
  (`new Date().getHours() >= 20`). State is local-only. Auto-switch is
  configurable. Toggle is NOT included in share URL state.
- Tier 2 share: realtime family session via backend.
- Capacitor/React Native wrapper.
- Retroactive dose entry from the timeline.
- Vitamin/cough-syrup daily program.
- Notifications / reminders.
