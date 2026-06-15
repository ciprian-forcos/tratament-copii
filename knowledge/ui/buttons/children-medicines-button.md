---
type: UI Button
title: Children Medicines Button
description: Entry from the children/menu area to the restored medicines page.
resource: src/components/design/ChildrenScreen.tsx
tags: [button, children, medicines]
timestamp: 2026-06-15T22:30:00+03:00
---

# Page

* [Children screen](../children-screen.md)

# Destination

* [Medicines page](../medicines-page.md)

# Functionality

* [Medicine editing](../../functionality/medicine-editing.md)

# Status

Implemented in Phase 06 Lane D. The button appears in the Children footer and
calls `onMedicines`, which `FlowProtoB` handles by routing to the `medicines`
page.

# Citations

* `.planning/phases/06-hardening/06-04-install-and-medicines-PLAN.md`
* `src/components/design/ChildrenScreen.tsx`
* `src/components/design/FlowProtoB.tsx`
