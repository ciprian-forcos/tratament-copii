# Design lab: Fir ("the thread")

Branch `claude/design-lab`. Open it from the **Lab** tab at the top of the phone (`?v=lab`).
The owner gave this branch full creative freedom: explore design, set medical constraints aside for now.
The three existing layouts (Acum, Edi, Fane) are untouched; Fir sits beside them as a fourth.

## What stays

- The data: `timeline/store.ts` (dose, temperature and note facts), `timeline/project.ts` (the projected next doses), `childStore`, `medicineStorage`.
- The looks and palettes: Fir is styled only through the look tokens, so Grec, Material, Sticlă, every colour skin and every night palette apply.
- The product rules the three people agreed on, where they are design rules rather than medical ones:
  - Ciprian: a timeline you attach events to. Past doses filled, future doses empty.
  - Edi: grouped pictograms, less text.
  - Fane: weekday lines, `acum` you can always get back to, a quick add, the dose you swipe or type.

## The idea

One continuous thread you can throw with your thumb, and one card that tells you what's next.

1. **The thread.** A real horizontal scroller with momentum, not a pan gesture. An hour is a fixed width, the thread covers days, and weekday lines mark midnight ("Luni 28"). A fixed needle marks now. When now is off-screen, a pill says `« acum` or `acum »` and throws you back.
2. **Beads.** Every event is a bead on the thread:
   - Doses show the medicine's form as a pictogram (syrup, drops, spray, suppository) in its colour. They're filled when given and hollow when planned.
   - Temperatures are small pins with the value, coloured by heat.
   - Notes are a small speech tick.
   - Tap a bead for its card: when, what, how much, delete.
3. **Next card.** The one thing that matters at 3am.
   - The next medicine's pictogram sits inside a countdown ring that closes as the time comes.
   - The name, the amount (swipe it up or down, or tap to type it), and "peste 1 h 12 min".
   - One big "Am dat" button. After tapping it, a 6-second "Anulează" undo replaces confirmation dialogs, and double taps are ignored.
4. **Faces.** Children are faces, not name chips. A face flushes when the last temperature was a fever. Tap to switch child; long-press to edit.
5. **Quick add (+).** One sheet of grouped pictograms:
   - dose (each medicine, plus "alt medicament" to create one inline);
   - temperature (a round dial you drag);
   - note (preset pictograms: slept, ate, vomited, rash, plus free text).
6. **Settings.** Fane's treatment window: which medicines each child takes, the child's weight, share by link.
7. **Joacă.** A fourth look for kids' palettes: thick ink outlines, hard offset shadows, and buttons that sink when pressed (neo-brutalist). It pairs with Mario, Patrulă, Burete.

## Motion

Everything moves through the look's `--ease` / `--dur` tokens: springs in Material and Sticlă, quick and quiet in Grec, a hard snap in Joacă. The phone's reduce-motion setting stops all of it.

## Phases

1. Shell, thread, beads, needle, `acum` pill, next card with Am dat + undo.
2. Quick add: dose, temperature dial, notes, inline new medicine. Bead cards with delete.
3. Faces, settings sheet, share link.
4. Joacă look, polish, motion pass.

Each phase: tests first where behaviour changes, then `npx eslint src`, `npx vitest run`, `npm run build`, screenshots in every look, and a hosted preview.
