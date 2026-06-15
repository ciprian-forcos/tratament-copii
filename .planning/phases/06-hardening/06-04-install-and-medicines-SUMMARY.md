---
phase: v1-phase-06-hardening
plan: 06-04
status: complete
date: 2026-06-15
---

# Summary: Install And Medicines (06-04)

## What Changed

* Added the Home `Instalează aplicația` affordance with `beforeinstallprompt`,
  manual fallback guidance, and standalone-mode suppression.
* Registered the production service worker and copied `sw.js`, `manifest.json`,
  and root icons into `dist/` during build for GitHub Pages.
* Prevented the service worker from caching `?import=...` share payload URLs.
* Restored the `MedicamenteTab` path from Children via `FlowProtoB`.
* Centralized medicine persistence in `medicineStorage.ts` using
  `tratament-copii-medications`.
* Synced imported medicines into the active route without requiring a reload.
* Verified the restored path starts with default antipyretics and persists
  added medicines across remounts.

## Verification

* `npm run test -- HomeB`
* `npm run test -- ChildrenScreen`
* `npm run test -- FlowProtoB`
* `npm run test -- Medicamente`
* `npm run test`
* `npm run type-check`
* `npm run build`
