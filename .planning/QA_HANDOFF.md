# V1 — QA Handoff

Autonomous run complete. All 8 plan-units delivered through the Sonnet→Opus
gate chain. V1 is feature-complete and gate-green on **`origin/v1-delivery`**
@ `99c4406`. This is the one human gate: QA it as a real user, then merge.

## Acceptance status (automated, from V1_ACCEPTANCE.md)

- **A. Gate** — type-check ✓ · lint ✓ · **113 tests / 14 files** ✓ · build ✓
- **B. Functional scope** — all 5 phases present (dose records, night timeline,
  schedule engine, children screen, share Tier-1).
- **D. Data safety & scope** — protected localStorage keys unchanged; no
  notifications / cloud / accounts / panic-toggle-in-share leakage; legacy tabs
  retained; Romanian copy.
- **C. Stopwatch criteria** + **manual flows** — YOUR QA below.

## How to QA (≈10 min)

```bash
git fetch origin
git checkout v1-delivery
npm install
npm run dev
```

### What to try — framed on the 3 AM use case
1. **Calm setup (<60s):** ≡ → Copii → "+ Adaugă copil". Add a child (name,
   age, weight). Confirm it persists after a refresh.
2. **Panic flow (<30s):** Home → temperature → "Primul tratament" → the plan
   card should say one clear thing ("Dă X ml de Nurofen acum"). Time yourself.
3. **It remembers:** tap "Am dat doza" → return Home → a real dot appears on
   the "noaptea asta" strip with the med name. Refresh → it survives.
4. **Real next dose:** walk the flow with "Ultima doză a fost" → Nurofen at a
   past time → confirm the "next" time reflects the engine (≥2h spacing, and
   the per-drug interval), not a flat +2h.
5. **Per-child scoping:** switch active child → the timeline is that child's
   own.
6. **Share (two browser profiles / incognito):** ≡ → Partajează → pick a child
   (or "Trimite toată aplicația") → Generează linkul → Copiază. Paste the link
   in a second profile → confirm-merge sheet → Importă → check ≡ → Copii shows
   the merged child. Refresh → the import prompt does NOT reappear.
7. **Bad link:** open `…/?import=garbage` → an error sheet appears; dismissing
   it cleans the URL.
8. **Privacy:** the imported child carries no temperature (temp is never shared).

## After QA — ship it

```bash
git checkout main
# bump version to 1.0.0 (V1 ships → 1.0.0 per PROCESS.md versioning)
npm version 1.0.0 --no-git-tag-version
git add package.json
git commit -m "[release] v1.0.0"
git merge --no-ff v1-delivery -m "[release] merge V1 (phases 1-5) to main"
git push origin main           # GitHub Pages auto-deploys
git tag v1.0.0 && git push origin v1.0.0
```

(If you'd rather review as a PR first: open `v1-delivery` → `main` on GitHub,
read the diff, then squash/merge.)

## V2 backlog (from ROADMAP + 05-03 SUMMARY)
- Panic mode: auto-on after 20:00 device time + manual toggle; state is
  local-only and NEVER included in the share URL.
- Tier-2 share: realtime family sync via backend.
- Retroactive dose entry from the timeline; vitamins/cough-syrup program;
  notifications; optional gzip on share URLs for larger payloads.
