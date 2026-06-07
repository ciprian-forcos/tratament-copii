---
phase: 05-share-tier1
plan: 05-03
status: complete
date: 2026-06-07
---

# Summary: Import / Merge Flow (05-03)

## What was built

### `src/components/design/share/merge.ts`
Pure, side-effect-free merge helpers:
- `mergeChildren(local, incoming): { merged, summary }` — matches by `id`; incoming overwrites field-by-field; **preserves local `temp`** when incoming lacks it (privacy: `temp` is stripped at encode time and must not zero out the receiving device's current measurement); new ids append after local list; returns a `MergeSummary` with `added/updated/unchanged` child name arrays.
- `mergeMedications(local, incoming): Medication[]` — same id-match strategy, no summary.
- Both use `Map` for O(n) merge.

### `src/components/design/share/ImportGate.tsx`
React component wrapping the app root (`props: { children: ReactNode }`):
- On mount, reads `window.location.search` for `?import=...`.
- **Absent** → renders children normally, no UI.
- **Present + decodable** → renders children *behind* an overlay confirm sheet ("Importă date partajate") showing a dry-run merge summary (Adaugă / Actualizează rows). "Importă" applies the merge to `childStore` and, when the payload includes medications, writes the merged medications list to `localStorage['tratament-copii-medications']`. Then calls `history.replaceState(null, '', pathname)` to clean the URL and closes.  "Anulează" closes and cleans the URL without applying anything.
- **Undecodable** → error sheet ("Link invalid") with "Închide" that also cleans the URL.
- URL cleaning is done via `history.replaceState` on every dismissal path (confirm, cancel, error) — never via `location.href` assignment.

### `src/App.tsx`
`<ImportGate>` now wraps `<FlowProtoB />` inside `.phone-inner`, so the overlay sheet is contained by the phone bezel on desktop and full-bleed on mobile.

## V1 feature-complete

All five plans across five phases are shipped:
1. 01-01: Dose records store
2. 02-01: Night timeline
3. 03-01/03-02: Schedule engine
4. 04-01: Children screen
5. 05-01/05-02/05-03: Share Tier 1 (encoder + ShareSheet + ImportGate)

## Outstanding V2 backlog items (per ROADMAP.md)

- **Panic mode**: auto-activate after 20:00 device time (manual toggle too); NEVER included in share URL state (privacy).
- **Gzip compression** for share URLs (CompressionStream, deferred from 05-01).
- **Medication schedule editing** UI (rules are computed but not configurable in-app).
- **Push / background reminders** (next-dose notification when app is closed).
- **Multi-device sync** (beyond URL-based Tier 1 sharing — e.g., QR code, NFC, server relay).
- **Offline PWA hardening**: full SW test suite + update prompt.
- **Analytics / error boundary**: crash reporting for production.

## Suggested first V2 follow-up

**Panic mode** — auto-on after 20:00 local device time, manual toggle in HomeB header. Rule: `temp` field participates in the display but is NEVER serialised into the share URL payload (privacy constraint already enforced by `encoder.ts:sanitizeChild`).

## Suggested ship action

Create git tag `v1.0.0` and add a `MILESTONES.md` entry:

```
git tag v1.0.0
git push origin v1.0.0
```

Then add to `MILESTONES.md`:
> **v1.0.0** (2026-06-07) — V1 feature-complete: dose records, night timeline,
> schedule engine, children screen, Tier 1 share (URL encode + confirm import).
