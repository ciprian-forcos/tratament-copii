# V1 Acceptance Checklist

The concrete, user-level definition of "V1 is done." Derived from
`BRIEF.md` ("Success criteria for V1") and the roadmap scope. The
orchestrator runs this on the final `v1-delivery` tip before handing off
to the human (see PROCESS.md "V1 acceptance & QA handoff"). **Any
unchecked box is a stop condition** — the run does not present V1 as done
with a failing item.

Each item says how to check it. "Automated" = a test or the gate proves
it. "Manual" = the human confirms it during QA; the orchestrator stages
the preview so the human can.

## A. The gate (automated — hard prerequisite)

- [x] `npm run type-check` exits 0 *(re-verified 2026-07-25 on `main@54be582`)*
- [x] `npm run lint` exits 0 *(re-verified 2026-07-25)*
- [x] `npm run test` exits 0, and every phase's new units have tests
      *(135 tests / 18 files, re-verified 2026-07-25)*
- [x] `npm run build` exits 0 and produces `dist/` *(re-verified 2026-07-25)*
- [x] `sw.js` cache name matches the new build hash (PWA serves fresh assets)
      *(automated by the Vite `sw-cache-version` plugin; confirmed in dist)*

## B. Functional scope (automated where possible, else manual)

Maps to the five phases. Each phase's `*-SUMMARY.md` must exist and its
behavior must hold on the final tip.

- [x] **Calm setup** — a parent can add a child (name, age, weight) and it
      persists across reload. *(Phase 4 / children screen)*
- [x] **Panic flow** — Home → Step 1 (temp) → Step 2 (first/last
      treatment) → Plan card renders one clear "give X ml of Y now"
      result. *(design B, wired through the real engine)*
- [x] **"Am dat doza" persists** — tapping it records an
      `AdministeredDose`; the record survives reload and appears on the
      night timeline. *(Phases 1 + 2)*
- [x] **Next dose is real** — the plan card's next-dose time comes from
      `scheduleEngine` (min 2h Nurofen↔Panadol), not a hardcoded `+2h`.
      *(Phase 3)*
- [x] **Timeline reflects reality** — `HomeB` renders administered doses
      from the store; the `defaultTimeline()` stub is gone. *(Phase 2)*
- [x] **Share works** — a parent can produce a per-child or whole-state
      share link; opening it on a second device shows a confirm-merge
      sheet and imports correctly. *(Phase 5)*

*(B items: phase summaries exist for 00→06 and the behaviors are locked by
the test suite; human spot-check during final QA still recommended.)*

## C. The two stopwatch criteria (manual — the heart of the brief)

- [ ] **< 60 s** to set up a child from a cold start, in calm mode.
- [ ] **< 30 s** to get a correct dose plan in the panic flow at "3 AM."
      The orchestrator can't time the human, but it verifies the flow is
      ≤ 2 questions to the plan card and flags any added friction for the
      human to time.

## D. Data safety & scope discipline (automated/manual)

- [x] The three protected localStorage keys are unchanged in name; any new
      keys are additive. **No returning user loses data on upgrade.**
- [x] Nothing from the "NOT in V1" list leaked into the UI: no
      notifications, no cloud sync/accounts, no surfaced custom-med
      editor, no vitamins/cough-syrup program, no panic-mode toggle in the
      share URL.
- [x] Legacy tab components (`MedicamenteTab`, `CopiiTab`, `ProgramTab`)
      still present (reference material), not deleted. *(`MedicamenteTab`
      path restored in phase 06-04 per product decision.)*
- [x] All user-facing copy is in Romanian and reads calm, not alarming.

## E. QA handoff produced (orchestrator)
- [x] **Hosted for mobile QA:** the version is deployed to a GitHub Pages
      URL reachable from a phone (not just localhost), the human is given
      that URL + an "Add to Home Screen" note, and it is confirmed to load
      on a mobile device. See PROCESS.md "Hosting for QA".
      *(deploy.yml auto-deploys `main`; human QAd the V1 build on phone in
      June — the 12 filed bugs were fixed in phase 06)*

- [x] `v1-delivery` exported (bundle copied to the user's folder, or
      pushed to origin) at a known SHA, recorded in `DELIVERY_STATE.md`.
- [x] Built `dist/` staged so the human can click through immediately.
- [x] A short "what to try" script written for the human, framed around
      the 3 AM use case. *(see `.planning/QA_HANDOFF.md`)*

---

**Status 2026-07-25:** A, B, D, E hold on `main` (phase 06 hardening
included). Only C — the two human stopwatch timings on the *hardened* build —
remains. When C passes on the phone, V1 is done: bump `1.0.0` and tag per
PROCESS.md "Release steps".
