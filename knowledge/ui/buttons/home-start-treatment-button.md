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

`HomeB` calls `onStart`; `FlowProtoB` routes to `page === 's1'`.

# Known Bug

* [Phantom countdown before treatment starts](../../bugs/phantom-countdown-before-treatment.md)

# Citations

* `src/components/design/HomeB.tsx`
* `src/components/design/FlowProtoB.tsx`
