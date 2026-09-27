# Handoff: themes

Written so another agent can restyle the app without reopening the product argument.

The owner wants you to take a crack at the **themes** (the color skins). Do not reopen the timeline, the three layouts, or the medication rules unless a theme makes text unreadable.

## Why the look changed

The first visual system was the default dark agent theme: charcoal `#0d1115`, amber `#f5b14a`, Caveat handwriting, dashed "sketch" borders, glow, rounded pills. It showed up because that is what the coding agents reach for. The three people below are why it was dropped. Quotes are theirs, from 25 September 2026. English gloss is only so you do not miss the Romanian.

The Greek marble skin (warm stone, black ink, one terracotta, Cormorant Garamond / Source Serif 4, straight rules, no glow) is the answer to Ciprian's "eternally beautiful" note. The ten named palettes in `src/skins.css` are a later request: skins in the spirit of what children watch now. They are first passes. Your job is to make the palettes good. Do not draw the characters.

Streaming and parent surveys from 2026 (Animation Magazine H1, Lingokids ages 3–8) are why that list. Bluey, SpongeBob, and Paw Patrol are what parents are actually playing. Mario, Sonic, and Spider-Man are names boys gave. Moana stands in for the girls' film list (Elsa, Moana). Dragon Ball stands in for the anime searches (One Piece, Naruto, Doraemon, Dragon Ball).

## Ciprian

He owns the product. The app is a timeline you attach events to. Medication rules hang off that tape. He got tired of the agent look and said so in his own words.

On the function, to Edi:

> Eu doar imi doresc un timeline, pe care sa imi puna aplicatia evenimentele de tip "administrare de medicament".
>
> I only want a timeline, onto which the app puts events of the type "a medicine was given."

> Doar ca toate aiurile sunt obsedate de tema asta, dar pot sa ii dau si un alt stil.
>
> All the AIs are obsessed with this theme, but I can give it another style too.

> Daca schimb designul de culori/forme … Iti place ideea de functionare?
>
> If I change the colors and the shapes… do you like how it works?

He also asked Edi whether it is annoying that the clock is not visible at rest, and offered a small clock icon plus a small medicine icon, or a child's face plus a medicine. That question is why Edi's layout has a face, a small clock, and medicine marks, and why the big analog clock had already been removed from Home.

After that conversation he narrowed the look, still in his words:

> o tematica greceasca poate
>
> a Greek theme, maybe

> ceva etern frumos ca si stil
>
> something eternally beautiful as a style

> orice altceva decat mazgalelile de claudiu moderne
>
> anything other than the modern Claude scribbles

"Mazgaleli" is scribbles: the handwriting, the dashed borders, the glow. Not a request to delete the wavy dose line. The line stays. The scribble chrome goes.

Later he asked for about ten more skins, starting with Mario, The Lion King, Paw Patrol, Dragon Ball, and other things children watch now (Bluey and the rest of the list above). Then: have Claude take a crack at the themes. That is this document.

He also settled, across the build, and these are constraints not quotes:

- Past doses are filled marks. Future doses are empty rings. The next ring shows the millilitres.
- Temperature is attached at a moment and is not painted on the line all the time.
- Pull down (or the settings sheet) for child chips and medicine chips. Long-press edits. Share stays out of that drawer.
- No big clock, no Calm / Auto / Noapte panic toggle, no tab bar on the rest state.
- Acum / Edi / Fane must be tappable. A fixed bar under the phone frame was not.

## Edi

Edi is Dr. Cumnat Alex Florea, Ciprian's brother-in-law. He looked at the ultra-minimal dark screen. He does not claim taste. He claims the theme is the default one.

> Voiam să știu dacă îți place designul ultra minimalist. Nu e stilul meu, ți-am zis cum o vedeam după gustul meu, cu pictograme grupate.
>
> I wanted to know if you like the ultra-minimalist design. It isn't my style. I told you how I saw it, to my taste: grouped pictograms.

> Ca mi se pare ca atunci cand alegi meniul, tot ajungi la o tona de scris. Ca e ascunsa dupa un click sau apare direct, nu mi se pare mare diferență.
>
> Because when you open the menu you still end up with a ton of writing. Whether it is hidden behind a click or shown immediately, I don't see much difference.

> Dar estetic sunt cel mai puțin competent să zic. Văd tema de la Claude și înțeleg sunt variații după defaultul lor. Adică nu înțeleg dacă nu mai au și alta. Gen nu vor? Se canibalizează cu alt produs al lor? Gen nu merge pus alt font și schimbat portocaliul? Ca deja le văd peste tot.
>
> Aesthetically I'm the least qualified to say. I see the Claude theme and I get that these are variations on their default. I don't understand if they just don't have another one. They don't want one? Does it cannibalize another product of theirs? Can't you put another font and change the orange? I already see them everywhere.

On the function, after Ciprian described the timeline:

> Da, functionalul e baza.
>
> Yes, the function is the base.

> Da, e nice.
>
> Yes, it's nice. (About how it works, if the colors and shapes change.)

On trying a small clock and a child/medicine icon instead of a hidden clock:

> Cred ca ar merita sa încerci și variantele astea. Sa vezi cum ți se par. Ca până nu le vezi…
>
> I think those variants are worth trying. See how they feel to you. Because until you see them…

So Edi's layout (`HomeEdi`) is: same tape, pictograms grouped and visible (face, small clock, medicines), less writing on the line. He did not ask for a teal redesign. The teal pass was an early sketch and was later pulled onto the shared skin tokens. Do not treat Edi as a separate color system.

## Fane

Fane is Stefan Saru. He used the live dark timeline (the GitHub Pages build, before the marble skin) and marked two screenshots. He likes the app and would have wanted it in the first two years, when they were living on alarms and a calendar. He also changed his mind about storage: he used to want everything on the device, and now he likes that it can live in the browser or a URL.

His notes, in order:

> si daca apare spontan un alt tip de medicament in tratament, poate ar merge si un Quick / Add Other / [+]
>
> and if some other kind of medicine shows up spontaneously in the treatment, a Quick / Add Other / [+] could work

> da e misto aplicatia … o sa o folosim si noi … In primii 2 ani a fost horror. Ne-am chinuit cu alarme si calendar. Atunci ar fi mers la fix.
>
> yeah the app is cool… we'll use it too… The first two years were awful. We struggled with alarms and a calendar. It would have been exactly right then.

> Imi place cum stochează date, cumva in url sau in browser.
>
> I like how it stores data, somehow in the URL or in the browser.

> mi-am schimbat parerea :) … erai suporterul stocatului on device
>
> I've changed my mind. (Ciprian: you were the one who supported storing it on the device.)

> Poate niste linii verticale cu zilele săptămânii. Luni 5 sept. ceva finutz sa mearga cu designu.
>
> Maybe some vertical lines with the days of the week. Monday 5 Sept. Something fine, that goes with the design.

> cand dai click pe [acum] sa il puna in prim plan si sa nu dispara de pe ecran. gen sa apara "<< acum" daca ai dat scroll in partea dreapta prea mult.
>
> when you tap [acum], bring it to the front and don't let it leave the screen. Like, show "<< acum" if you've scrolled too far to the right.

> poate un buton setari care deschide fereastra cu tratament
>
> maybe a settings button that opens a treatment window

> Poate acest camp sa fie editabil, daca ii dai 3 pufuri sa poti da swipe down pe camp și sa incrementeze. Sau swipe up si sa faca -1. Si daca dai tap clasic sa poti edita ca text valoarea.
>
> Maybe this field can be editable. If you're giving 3 puffs, swipe down on the field to increment, swipe up to subtract 1. A normal tap lets you edit the value as text.

The two pictures he marked are in this repo:

- [knowledge/process/theme-conversation/fane-next-dose-ring.jpeg](knowledge/process/theme-conversation/fane-next-dose-ring.jpeg) — 19:45. The live night line. A green circle around the next hollow ring (Nurofen, 7 ml) and a green arrow onto it. This is the mark he wants kept in the foreground and easy to hit. It is not a request to invent a new chart.
- [knowledge/process/theme-conversation/fane-swipe-amount.jpeg](knowledge/process/theme-conversation/fane-swipe-amount.jpeg) — 20:09. The attach sheet. A blue circle around **2 pufuri**, between the medicine chips and Confirmă. That circled field is the swipe-or-type amount.

`HomeFane` is the attempt to build those notes on the same tape: weekday hairlines, an `acum` chip when now leaves the screen, a settings sheet with children, medicines, and +, and a dose amount you drag or type. The palettes came later and were not his request. When you recolor, his amount and his `<< acum` still have to read.

## What a theme is, and what it is not

Two independent switches sit on the phone:

1. **Layout** — top row: Acum / Edi / Fane. Same timeline, three arrangements. A skin must not merge these or delete one.
2. **Skin** — second row. A palette applied with `data-skin` on `.phone-inner`. Saved in `localStorage` key `tratament-copii-skin`. Default is `grec` (no attribute; the variables in `:root`).

A skin is only the CSS variables. It does not change the path of the line, the filled-vs-hollow dose marks, the dose amounts, or which events exist.

## Where to edit

- `src/index.css` — `:root` tokens. This is the Greek marble default. Also the phone frame and type styles.
- `src/skins.css` — one `[data-skin="…"]` block per extra palette. Override the same variables. Set `color-scheme` when the ground is dark.
- `src/components/design/skins.ts` — `{ id, label }` list. `id` must match the CSS attribute. Unknown ids fall back to `grec`.
- `src/components/design/SkinBar.tsx` — the scrolling row. It already uses the variables, so a new skin recolors it.
- `src/App.tsx` — `data-skin={skin === 'grec' ? undefined : skin}`.

Tokens a skin must set:

`--bg`, `--bg-2`, `--bg-3`, `--ink`, `--ink-2`, `--ink-3`, `--line`, `--line-2`, `--accent`, `--accent-2`, `--accent-wash`, `--on-accent`, `--danger`, `--safe`, `--cool`.

`--cool` is the fill of a dose already given. `--accent` is the next dose and the selected chip. `--on-accent` is the text on a filled accent button. If you only change `--accent` and leave `--on-accent` cream, a yellow skin becomes unreadable.

## Layouts you must leave alone

- **Acum** (`HomeB`): the wavy line, grabber for children and medicines, tap the line to attach temperature / dose / note. Temperature is stored and not painted on the line. The active child's name is on the tape.
- **Edi** (`HomeEdi`): same tape, pictograms on top (face, small clock, medicine marks), less writing on the line.
- **Fane** (`HomeFane`): same dark-or-skinned tape, fine weekday lines ("Luni 7 sept"), `acum` returns if you scroll it off, a settings sheet for the child and medicines, a quick add, and a dose amount you swipe or type.

Medication rules stay in `src/components/design/timeline/project.ts`. Facts stay in `timeline/store.ts`. Do not invent a second schedule.

## What "a crack at the themes" should mean

The ten palettes in `skins.css` are first passes from public color memory. They are flat and some will fail at 3am (yellow ground, pale ink, accent that disappears on the ground). Improve them. Do not add Mario's hat, a puppy badge, or a studio logo.

Judge each skin on a phone-sized frame, on **Acum**, with a past dose and a next dose visible:

- The line is visible on `--bg`.
- A filled dose and an empty ring are distinguishable.
- The amount (for example `8 ml`) can be read without squinting.
- Selected chips use `--on-accent` and stay readable.
- Dark skins set `color-scheme: dark`.

The Greek skin is the calm default on purpose. You may refine it. Do not replace it with the old charcoal-and-amber look.

## How to add one

1. Add `[data-skin="id"]` in `src/skins.css`.
2. Add `{ id, label }` in `src/components/design/skins.ts`.
3. `npm run type-check` and `npx vitest run src/components/design/skins.test.ts src/App.test.tsx`.

## Out of scope

- Official character art, catchphrases, or trademarks used as if this were a licensed product.
- Putting the theme switch back `position: fixed` at the bottom of the viewport. It sat under the phone frame and could not be tapped. It lives in normal flow at the top of `.phone-inner`.
- Deploy secrets. Pushing `main` already publishes GitHub Pages via `.github/workflows/deploy.yml`.
