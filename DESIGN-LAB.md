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

## Where it is

All four phases are built, tested and screenshotted in every look, light and dark:

1. **Thread and next card** (`src/lab/Thread.tsx`, `NextCard.tsx`, `thread.ts`): the momentum scroller over six days, night bands, weekday lines, the now needle, the `acum` pill, pictogram beads (filled given, hollow planned, breathing next), temperature and note pins, and the countdown ring with swipe-or-type amount and one Am dat.
2. **Quick add and bead cards** (`AddSheet.tsx`, `TempDial.tsx`, `dial.ts`, `BeadCard.tsx`):
   - dose for any medicine, or a new one created inline with its form;
   - a 270° temperature dial with heat bands;
   - note presets;
   - when chips (acum … −1 h);
   - bead cards with Am dat acum or Șterge.

   Every add and delete has a 6-second undo, and double taps are ignored.
3. **Faces and settings** (`Face.tsx`, `mood.ts`, `SettingsSheet.tsx`): moods follow the thread (flushed after a fever, eyes closed after Doarme); tap to switch, long-press to edit; Fane's treatment window with programme switches and share by link.
4. **Joacă** (`src/looks.css`, `src/night.css`): the fourth look, with a night version, contrast-tested like the others.

Checks: `npx eslint src`, `npx vitest run` (lab tests in `src/lab/*.test.*`), `npm run build`.

## Grafic: the fever as a stock chart

Ciprian: "Hai să facem un design care să semene cu un grafic de la o platformă de investiții." A fifth layout behind the **Grafic** tab (`?v=grafic`), in `src/lab/Grafic.tsx`, `Chart.tsx` and `grafic.ts`:

- **Quote.** The latest temperature is the price, big and in mono. The change over the range shows ▲ in red when it's hotter and ▼ in green when it's cooler, because up is bad here.
- **Chart.** Monotone area line with readings, a dashed fever line at 38°, a price tag on the right axis and a pulsing last reading. After now there's a forecast zone.
- **Volume.** Doses are volume bars in the medicine's colour, filled when given and dashed when planned.
- **Range and scrubbing.** Range tabs 6O / 12O / 1Z / 3Z / 1S. Drag across the chart to scrub, and the quote follows the crosshair.
- **Stats row.** Max and min over 24h, doses over 24h, and the time of the last dose. Under it, the next dose.
- **Watchlist.** Every child with a sparkline, the latest value and the 24h change. Tap a row to switch child.
- **Ticket.** Two buttons, like Buy and Sell: Temperatură (opens the dial) and Am dat doza.
- **Încarcă un exemplu.** Seeds a made-up 30-hour episode (`demo.ts`) so the chart can be explored without real data. It can be undone.
- **Bursă.** A sixth look: a dark trading terminal with yellow accent, green and red, IBM Plex, 4px corners and no bounce. It passes the contrast test and applies to every layout.

## Ideas not built yet

- Zoom: pinch or a toggle between hours and a week of beads.
- Drag a given bead along the thread to fix its time.
- A temperature curve layer you can switch on over the thread.
- Reminders (notifications) at the next dose, with the countdown ring on the lock screen via a web push.
- A night-light mode: red on black, the dimmest possible screen, for checking at 3am without waking anyone.
