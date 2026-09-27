# Handoff: looks (Material, Liquid Glass) and the NHS baseline

This file is for an implementing agent (Grok or another). It covers the design and the architecture. What is already built is marked **done**; everything under "Your work" is open.

Read `THEME-HANDOFF.md` first for the product rules and the three people's quotes. Nothing here overrides it: the timeline, the three layouts (Acum / Edi / Fane) and the medication rules stay as they are.

## The decision

A "skin" used to mean colours only. The owner wants a switch that changes **how the app looks and moves**, not only its colours: button shapes, depth, press feedback, animation. He picked:

- **Material 3 Expressive** (Google) as a look.
- **Liquid Glass** (Apple, iOS 26) as a look, named **Sticlă** in the app.
- **Motion**, done properly.
- **NHS / GOV.UK rules** as a *must-have baseline under every look*, not a look of its own.

## The model

Two independent choices, both in the **Temă** menu at the top of the phone:

| Choice | Attribute on `.phone-inner` | Storage key | Values | Owns |
|---|---|---|---|---|
| **Stil** (look) | `data-look` | `tratament-copii-look` | `grec` (no attribute), `material`, `sticla` | shape, depth, press, motion, fonts, and a default palette |
| **Culori** (palette) | `data-skin` | `tratament-copii-skin` | `grec` (no attribute), `mario`, … | colours only |

`src/looks.css` is imported **before** `src/skins.css`. So a look brings its own colours, and choosing a palette other than Grec replaces them: Material + Mario = Material shapes in Mario colours.

## Tokens (done)

Colour tokens are unchanged (`--bg`, `--ink`, `--accent`, `--on-accent`, …; see `THEME-HANDOFF.md`).

Structural tokens a look may set. Every one has a Grec fallback at the point of use in `src/index.css`, so an unset token means "Greek".

| Token | Meaning | Grec | Material | Sticlă |
|---|---|---|---|---|
| `--r-btn` / `--r-btn-on` | button radius, and radius when selected | 2px | 999px → 14px | 999px |
| `--r-chip` / `--r-chip-on` | chip radius, and radius when pressed on | 2px | 999px → 12px | 999px |
| `--r-cta` / `--r-cta-press` | Confirmă radius, and radius while pressed | 2px | 999px → 16px | 999px |
| `--r-sheet`, `--sheet-inset` | sheet corners, gap from the edges | 2px, 0 | 28px top, 0 | 32px, 8px (floats) |
| `--btn-bg`, `--btn-border`, `--btn-shadow` | unselected button surface | bg-3, 1px line | tonal bg-2, none | glass tint + edge highlight |
| `--chip-bg`, `--chip-border` | unselected chip surface | falls back to btn | transparent, 1px line | falls back to btn |
| `--bar-bg`, `--bar-line`, `--bar-shadow`, `--r-bar`, `--bar-margin` | top bar | solid, hairline | flat | floating glass capsule |
| `--sheet-bg`, `--sheet-top`, `--sheet-shadow` | attach sheet | bg-2, top rule | bg-2, none | glass, shadow |
| `--glass` | `backdrop-filter` value | none | none | blur(22px) saturate(180%) |
| `--phone-wash` | image layer behind everything | none | none | two soft accent/safe glows, so the glass has something to refract |
| `--press` | transform while pressed | scale(.98) | scale(.96) | scale(1.04), glass swells |
| `--ease`, `--dur`, `--dur-sheet` | motion | ease-out, 120ms | spring with overshoot, 420 / 520ms | softer spring, 320 / 460ms |
| `--sheet-from` | where the sheet enters from | 16px down | off-screen bottom | off-screen bottom |
| `--hand-style`, `--hand-weight` | the `.hand` (names) type | italic 500 | normal 600 | normal 600 |
| `--cta-shadow` | Confirmă depth | none | none | inner highlight + accent glow |

Springs are CSS `linear()` curves. They need no JavaScript and no library. Keep it that way.

Glass rules from Apple's guidance, which the code already follows: glass only on the **control layer** (bar, Temă panel, sheet, buttons), **never on the tape or its marks**, and no glass stacked on glass.

## Shared classes (done)

Apply these instead of inline shape styles. Keep inline styles for layout only (flex, gap, padding, size).

- `.ui-bar`: the top bar (`LabBar`).
- `.ui-panel`: the Temă panel (`SkinBar`).
- `.ui-btn`: tabs and toggles. Selection comes from `aria-selected="true"` or `aria-checked="true"`, so do not colour it inline.
- `.ui-chip`: choice chips. The "on" state comes from `aria-pressed="true"`.
- `.ui-sheet`: the bottom sheet, including its enter animation.
- `.btn-primary`: the big action. Its text is now `var(--on-accent)`; it was hard-coded cream.

## NHS baseline (done)

1. **Double-tap guard.** `useGuardedTap` in `src/components/design/guardTap.ts` ignores a second call within 1s. It wraps Confirmă in `AttachSheet` (Acum, Edi) and in Fane's confirm. A dose can no longer be logged twice by a double tap. Test: `timeline/AttachSheet.test.tsx`.
2. **Visible focus.** Yellow `#ffdd00` outline outside a near-black ring, readable on any ground (GOV.UK pattern), on `.phone-inner :focus-visible`.
3. **Reduced motion.** With the phone's reduce-motion setting, every animation and transition in the phone becomes 1ms, including the pulsing next-dose dot.
4. **Reduced transparency.** Sticlă falls back to solid surfaces when the phone asks for less transparency or the browser cannot blur.

## Your work, in this order

Each step: write a failing test first where behaviour changes, then `npm run type-check`, `npx eslint src`, `npx vitest run`. Look at every step on a 390×844 screen in all three looks, with a dark palette (Dragon) too.

1. **Move the remaining controls onto the shared classes.** These still carry inline radius, border and background, so the looks do not reach them:
   - `timeline/SetupDrawer.tsx`: child chips and medicine chips → `.ui-chip` with `aria-pressed`; the drawer surface → the sheet tokens.
   - `ChildEditor.tsx`: its buttons and sheet.
   - `variants/HomeEdi.tsx`: pictogram tiles (they want `--r-btn`, plus `--btn-bg` and `--btn-shadow`).
   - `variants/HomeFane.tsx`: `gearStyle`, the settings dialog, the `acum` chip, the give-sheet → `.ui-sheet`, and `SwipeAmount`.
   - `HomeB.tsx`: the `medNote` overlay card (radius 16 inline) and the round temperature buttons in `AttachSheet` (`roundBtn`).
2. **Marks on the tape, per look.** Draw them with tokens, not by branching on the look name in TSX:
   - Material: the next-dose mark as an M3 "cookie" (scalloped) shape that turns slowly and morphs to a filled circle when the dose is given. Use CSS `d: path()` transitions on SVG, where both paths have the same point count. Draw the elapsed part of the tape as the M3 wavy progress line and the future part as a flat track.
   - Sticlă: a small glass lens over the next-dose ring. The tape itself stays solid.
   - Grec: leave it as it is.
   - Keep: past dose = filled mark, future = empty ring, next = shows the ml. Those are product rules.
3. **The confirm moment.** After Confirmă, the chosen ring should visibly become a filled mark (spring in Material and Sticlă, a plain 120ms fade in Grec) and the sheet should close. Right now it closes instantly.
4. **Palettes.** They fail readability. See the contrast table in the conversation summary below. The rule: the character colour goes on `--accent`, never on `--bg`. The tape must reach 3:1 against `--bg`, the next ring 3:1, amounts 4.5:1. Add a unit test that parses `skins.css` and `looks.css` and checks these ratios, so a new palette cannot regress them.
5. **The rest of the NHS baseline:**
   - Audit touch targets: at least 44px, and 48px in Material.
   - Button labels in sentence case, describing the action.
   - A second double-tap guard on any other button that writes to `timelineStore`, for example Fane's `[+]` quick add.
   - Error text next to the field, not in a toast.

## Do not

- Do not add a UI library (MUI, shadcn, Radix, Framer Motion). Tokens + CSS carry everything above.
- Do not branch on the look in TSX (`if (look === 'material')`). A look is CSS. If a component needs a new knob, add a token with a Grec fallback.
- Do not put glass on the tape, the marks, or full-screen backgrounds.
- Do not change `timeline/project.ts` or `timeline/store.ts`.
- Do not bring back handwriting, dashed borders or glow in any look.

## Conversation summary (why)

- Ciprian: "when I said skins, I meant keeping the functionality but changing how buttons appear entirely, animations to add or remove." Then: "material design, liquid glass sound promising, motion, NHS must-have." And: "with a button we should be able to load the new theme or skin or style."
- Research behind the picks:
  - Google tested Material 3 Expressive in 46 studies with 18,000+ people. People found key elements up to 4× faster, older users as fast as younger ones.
  - Apple limits Liquid Glass to controls, never content.
  - NHS buttons can ignore a double click because users double-click on slow connections or with tremors.
  - Carbon keeps quick motion for taps and slow motion only for interruptions. Fluent documents a "no motion" setting.
- Contrast on `main` as measured (ratios against `--bg`):

| skin | tape line | next ring | past dose vs next dose colour |
|---|---|---|---|
| grec | 1.5 | 6.1 | 2.6 |
| mario | 2.1 | 1.5 | 1.2 |
| sonic | 1.7 | 1.1 | 2.5 |
| burete | 1.4 | 3.4 | 1.1 |
| patrula | 1.3 | 4.2 | 1.1 |

A design canvas with proposed palettes (Greek night "red-figure", fixed Mario / Sonic / Burete) is at https://claude.ai/artifact/PbSLpnWCGMXudYzgK1mLj9. It is private to the owner unless shared.
