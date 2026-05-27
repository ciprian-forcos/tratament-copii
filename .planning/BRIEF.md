# Brief: Plan tratament febră — copii

## Vision

A fever-treatment guide for parents. Optimized for one moment: **3 AM, child has
41°C, no one has slept in 36 hours.** The parent opens the app, sees one big
clock, taps one button, answers two questions, and gets exactly one card that
says "Dă X ml de Nurofen acum. Următoarea doză: Panadol la 05:30."

Everything else is in service of that moment.

## Who it's for

Romanian-speaking parents of small children. Tech-comfortable when calm,
useless when tired. Already overwhelmed. Already googling. Already arguing with
their partner about whether the last dose was at 1:30 or 2:00.

## What's in scope for V1

A single-user PWA that:

- Remembers the child(ren): name, age, weight (calm-mode setup).
- Pre-loads the four antifever meds: **Nurofen, Panadol, Diclofenac, Novocalmin**
  (already in `src/data/medications.ts`).
- Runs the panic flow already built in design B:
  Home → Step 1 (temp) → Step 2 (first/last treatment) → Plan card.
- Persists "Am dat doza" so the night timeline reflects reality.
- Computes the next dose using the existing `scheduleEngine` (min 2h between
  Nurofen and Panadol).
- Lets one parent share state with the other parent via URL (Tier 1: state in
  the link, no backend). Per-child or whole-state.

That's V1. Anything else is V2.

## What's explicitly NOT in V1

- Cloud sync, accounts, multi-device live state. (Tier 2 of the share story.)
- Notifications / reminders for upcoming doses.
- Custom medication editor surfaced in the UI (data model stays, UI hidden).
- Vitamins, cough syrups, daily-program meds (Virodep, GreenTus, Vit C/D).
- Schedule history / analytics.

## V2 backlog (one-liners, not commitments)

- **Panic mode**: a manual toggle + auto-switch after 20:00 device time. When
  ON, the home screen is the panic flow; when OFF, calm-mode dashboard. Toggle
  state is **local** — never included in the share URL.
- Tier 2 share: shared family session with realtime sync (Firebase/Supabase/CF
  Worker).
- Capacitor or React Native wrapper (only if PWA hits a hard wall).
- Mark medications as administered from the timeline retroactively.

## Tech baseline (current state)

- React 18 + Vite 6 + TypeScript 5.6 (strict).
- Tailwind v4.
- PWA: `manifest.json` + `sw.js` (auto-bumped via Vite plugin).
- localStorage for persistence under three keys (must be preserved):
  - `tratament-copii-children`
  - `tratament-copii-active-child`
  - `tratament-copii-medications`
- Dose calc + schedule engine already in `src/utils/`.
- Design B GUI implemented in `src/components/design/` (uncommitted at time of
  writing — Phase 0 commits it).
- Repo: `github.com/ciprian-forcos/tratament-copii`.
- No test runner installed yet — Phase 0 adds Vitest + React Testing Library.

## App or web?

Both. It's already a PWA — installable on iOS/Android home screen, works
offline. That **is** the app. A native wrapper is a V2+ decision if push
notifications or App Store presence become non-optional.

## Success criteria for V1

- Parent can set up a child in under 60 seconds in calm mode.
- Parent can get a correct dose plan in under 30 seconds at 3 AM.
- `Am dat doza` actually persists; the timeline shows real history.
- Sharing a child to another parent's phone via URL takes one tap each side.
- `npm run build` passes; `npm run type-check` passes; tests pass.
- No data loss for any user upgrading from current `main`.
