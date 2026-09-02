# Knowledge Bundle Log

## 2026-09-02

* **Cycle 3 UX (C1–C3, C5, C7–C11)**: Step 2 no longer prefills last-dose
  time. Night-strip marks go through `layoutMarks` (collision clustering,
  edge clamp, max-width labels). Recorded marks outside now ± 6h are
  dropped; a next-dose mark beyond the axis is pinned with a chevron.
  `isPanicActive('auto')` uses `isNightWindow` (20:00–07:59). Program
  check-offs stay off the fever strip. Due Home CTA reads "Deschide
  planul"; a not-due PlanCard promotes "Voi aștepta". StatusBar uses
  `fmtHHMM` and ticks in the wizard. Install prompt moved to Copii.
  C4 (vitamin hours) and C6 (suppositories) remain blocked on medical
  calls. "Amintiri" wording parked.

## 2026-09-01

* **Cycle 2 stepper + Step2 RO time**: Weight/age steppers keep a live
  value so 10 rapid taps no longer collapse into one step. Step 2 last-dose
  mode seeds `lastAt` to now and shows the same `dd.mm.yyyy HH:mm` line as
  Program above the native `datetime-local` input.
* **Home timeline now cursor**: Replaced the filled now-dot with a short
  vertical tick on the night-strip curve, drawn behind dose marks. The tick
  is omitted when the next dose is already due, so the pulse-dot stays the
  now mark, and also when any dose mark is within 40 minutes of now, so the
  tick does not show through nearby `HH:MM` labels. `acum` sits at `top: 82`
  so it no longer kisses the next-dose column.

## 2026-08-31

* **Home timeline now label**: Moved the `acum` text below the night timeline
  track so it no longer sits on the now-dot / nearby dose dots. The now-dot
  stays on the strip; the label is under the SVG track.

## 2026-08-25

* **Reminders + tabs + height**: Local next-dose alerts (`Amintește-mi`),
  persistent Program/Febră/Copii/Meds tab bar, optional child height.
* **V2 Program + panic**: Calm home is the 24h Program (schedule, mark
  administered, rules). Night home (`Auto` after 20:00, or `Noapte`) is the
  fever clock. Copii can toggle enabled medicines. Panic pref is local-only.
* **Phase 08**: Fever treatment is now an episode. Home continues to the plan
  card while a dose exists in the last 24h. PlanCard uses stored history,
  persists a Step 2 last dose, and offers `Voi aștepta` when the next dose is
  still deferred.
* **Phase 07**: Home now derives the next planned dose from recorded history
  via `nextPlannedDose` + `buildPlan()`. No countdown until the active child
  has a dose; after Nurofen the parent sees Panadol at +4h (and the reverse).
  When the floor has elapsed, Home says `dă {med} acum` instead of `mai sunt 0m`.

## 2026-06-15

* **Phase 06 Lane D**: Added the Home PWA install affordance, registered/copied the service worker for Pages builds, restored the `MedicamenteTab` route from Children, centralized medicine persistence under `tratament-copii-medications`, and verified default antipyretics in the restored path.
* **Phase 06 Lane B**: Hardened Home by removing phantom next-dose state, centering the `acum` marker, splitting child/profile/temperature controls, changing Home temperature copy to `Temperatura`, and removing fake status icons.
* **Phase 06 Lane C**: Removed Children screen BSA/estimated-height display and the unsupported PlanCard `112 / pediatrician` banner.
* **Phase 06 Lane A review fix**: Added PlanCard guard for deferred first doses so the card shows the scheduled time and disables `Am dat doza` until the 4h floor is due.
* **Phase 06 Lane A**: Updated Step 2 treatment-history and dose-plan graph nodes after timing implementation: title copy is `Ai mai administrat altceva?`, previous-dose timing uses native `datetime-local` `lastAt`, previous-dose choices are Nurofen/Panadol only, and scheduling documents 8h same-drug plus 4h cross-drug timing.
* **Process**: Added [Phase 06 parallel execution map](process/phase-06-parallel-execution-map.md) to define serial and parallel worker lanes before implementation continues.
* **Process**: Added [Phase 06 fresh context execution](process/phase-06-fresh-context-execution.md) so implementation can spawn cold implementers and fresh reviewers from plan and graph nodes rather than chat history.
* **UI graph refinement**: Added repeated-instance rules and placement/overflow notes to page nodes and repeated button/control template nodes.
* **UI graph**: Added [UI interaction graph](ui/interaction-graph.md), feature nodes, functionality nodes, page/sheet nodes, and button/control nodes so implementation can trace specs to pages, controls, source functions, bugs, and Phase 06 plans.
* **Planning**: Added [V1 Phase 06 hardening overview](../.planning/phases/06-hardening/06-00-OVERVIEW.md) and grouped implementation plans for [treatment history/timing](../.planning/phases/06-hardening/06-01-treatment-history-and-timing-PLAN.md), [home screen hardening](../.planning/phases/06-hardening/06-02-home-screen-hardening-PLAN.md), [UI cleanup](../.planning/phases/06-hardening/06-03-ui-cleanup-PLAN.md), and [install/medicines](../.planning/phases/06-hardening/06-04-install-and-medicines-PLAN.md).
* **Ingest**: Ran wiki scan and repo-wide wiki ingest over `.planning/`, `specs/`, `src/`, package/tooling files, deploy config, verification scripts, and agent prompts.
* **Bug mapping**: Split [Phase 6 hardening bugs](process/phase6-hardening-bugs.md) into individual bug nodes under `bugs/` and mapped them to [V1 Phase 06 Hardening](process/v1-phase-06-hardening.md).
* **Refactor**: Split process-loop role notes into [Delivery loop roles](process/delivery-loop-roles.md), [Orchestrator role](process/orchestrator-role.md), [Implementer role](process/implementer-role.md), [Agent-Reviewer role](process/agent-reviewer-role.md), [Design-Reviewer role](process/design-reviewer-role.md), and [Human Reviewer role](process/human-reviewer-role.md).
* **Creation**: Added source-ingest nodes for [Repository source inventory](sources/repo-source-inventory.md), [Planning corpus](sources/planning-corpus.md), [Specs corpus](sources/specs-corpus.md), [Application source map](sources/app-source-map.md), and [Tooling and deploy source map](sources/tooling-and-deploy.md).
* **Creation**: Added [Delivery loop evaluation](process/delivery-loop-evaluation.md) to capture the harness effectiveness/overhead tradeoff and a lighter future loop.
* **Conflict ledger**: Planning/spec sources still contain old branch naming, stale roadmap state, legacy-tab retention constraints, and older `2h`/`6h` timing assumptions; current graph decisions supersede them where noted.
* **Rename**: Standardized the product concept name as [3 AM use case](product/3am-use-case.md) across graph links.
* **Decision**: Removed generated `knowledge/viz.html` from maintained graph artifacts; Obsidian is the maintained graph surface.
* **Update**: Added [Ponytail audit observations](process/ponytail-audit-observations.md) from the first repo-wide simplification audit.
* **Update**: Added [Version and phase branch naming](process/version-phase-branch-naming.md) to capture the `Vx/phase-*` branch and planning convention.
* **Creation**: Added [Knowledge schema](AGENTS.md) so wiki-scan/wiki-ingest can recognize this OKF bundle as the active project wiki.
* **Initialization**: Created the first OKF bundle for the project.
* **Creation**: Added product, medical, UI, implementation, process, and external-method concept nodes.
* **Source status**: Current implementation is [main](process/repo-branch-state.md); hardening bugs come from the newer planning branch described in [Phase 6 hardening bugs](process/phase6-hardening-bugs.md).
