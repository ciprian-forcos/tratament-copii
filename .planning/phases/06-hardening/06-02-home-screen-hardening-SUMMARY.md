---
phase: v1-phase-06-hardening
plan: 06-02
status: complete
date: 2026-06-15
---

# Summary: Home Screen Hardening (06-02)

## What Changed

* Removed the fake `now + 2h` / `Panadol` fallback from Home.
* Home shows no countdown, no next marker, and no next-dose time CTA when no real `nextDose` exists.
* Centered the `acum` marker in the 12-hour timeline strip.
* Split Home controls into child identity/menu, profile, and `Temperatura`.
* Removed fake signal/battery icons from `StatusBar`.

## Verification

* `npm run test -- HomeB`
* `npm run test -- ChildPill`
* `npm run test -- StatusBar`
* `npm run test -- useNightTimeline`
