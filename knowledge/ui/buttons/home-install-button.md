---
type: UI Button
title: Home Install Button
description: Add-to-home-screen affordance for the PWA.
resource: manifest.json
tags: [button, home, pwa, install]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Home screen](../home-screen.md)

# Functionality

* [PWA install entry](../../functionality/pwa-install-entry.md)

# Status

Implemented in Phase 06 Lane D. It appears in the Home footer when the app is
not already standalone. It calls the captured `beforeinstallprompt` prompt when
available; otherwise it opens manual add-to-home-screen guidance.

# Known Bug

* [Missing add-to-home-screen affordance](../../bugs/missing-add-to-home-screen-affordance.md)

# Citations

* `.planning/phases/06-hardening/06-04-install-and-medicines-PLAN.md`
* `manifest.json`
* `src/components/design/HomeB.tsx`
