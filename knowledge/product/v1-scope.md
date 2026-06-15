---
type: Product Concept
title: V1 Scope
description: V1 is a single-user PWA for child setup, panic treatment planning, dose recording, night timeline, and URL sharing.
resource: .planning/BRIEF.md
tags: [product, v1, scope, pwa]
timestamp: 2026-06-15T19:00:00+03:00
---

# Included

V1 includes child profiles, default antipyretic medications, the panic flow,
administered-dose persistence, a night timeline, schedule-based next-dose
calculation, and Tier 1 share-by-URL.

# Excluded

Cloud sync, accounts, live multi-device state, reminders, notifications, and
broad vitamin/cough-syrup program management are outside V1.

Phase 06 exception: the existing `MedicamenteTab` medicine editor is restored so
parents can add/edit medicines and verify default antipyretics. This is not a
new broad treatment-program surface.

# Why This Matters

The [3 AM use case](3am-use-case.md) requires fewer moving parts,
not a more general medical notebook. This is where [Ponytail simplification
discipline](../references/ponytail.md) should actively constrain future work.

# Connected Implementation

* [Local storage and app state](../implementation/app-state-local-storage.md)
* [Dose history store](../implementation/dose-history-store.md)
* [Share URL import and merge](../implementation/share-url-import-merge.md)

# Citations

* `.planning/BRIEF.md`
* `.planning/V1_ACCEPTANCE.md`
