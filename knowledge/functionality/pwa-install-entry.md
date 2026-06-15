---
type: UI Functionality
title: PWA Install Entry
description: Visible install path for adding the PWA to the home screen.
resource: manifest.json
tags: [functionality, pwa, install]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Home screen](../ui/home-screen.md)

# Button

* [Home install button](../ui/buttons/home-install-button.md)

# Source Functions

* `HomeB`
* `handleInstall`
* `isStandaloneDisplay`

# Behavior

`HomeB` captures `beforeinstallprompt`, prevents the browser's automatic prompt,
and stores the event for the visible install button. If no prompt event is
available, the same button toggles manual browser-menu guidance. If
`display-mode: standalone` matches, the install entry is hidden.

Production packaging links the manifest at `/tratament-copii/manifest.json` and
copies manifest icons to the same root path so install checks do not depend on
hashed asset URLs.

# Citations

* `manifest.json`
* `specs/app-overview.md`
* `.planning/phases/06-hardening/06-04-install-and-medicines-PLAN.md`
* `src/components/design/HomeB.tsx`
