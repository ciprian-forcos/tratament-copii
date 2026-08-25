---
type: UI Button
title: Home Start Treatment Button
description: Starts the panic flow from Home.
resource: src/components/design/HomeB.tsx
tags: [button, home, panic-flow]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Home screen](../home-screen.md)

# Destination

* [Step 1 temperature entry](../step1-temperature-entry.md)

# Functionality

* [Timeline and next dose display](../../functionality/timeline-and-next-dose-display.md)

# Handler

`HomeB` calls `onStart`. `FlowProtoB` routes to the plan card when the child
is in a 24h episode, otherwise to Step 1 and resets Step 2.

Label is `Începe tratamentul` with no in-episode history, and
`Următoarea doză · HH:MM` after a recorded dose.

# Known Bug

* [Phantom countdown before treatment starts](../../bugs/phantom-countdown-before-treatment.md)
  — empty-state still holds; Phase 07 added the real post-treatment label.

# Citations

* `src/components/design/HomeB.tsx`
* `src/components/design/FlowProtoB.tsx`
