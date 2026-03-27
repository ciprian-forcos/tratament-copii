# Children Profiles

## Purpose
Support multiple child profiles so the app can calculate correct doses per child.

## Data Model

```ts
interface Child {
  id: string
  name: string
  weight: number        // kg
  height?: number       // cm (optional, estimated from weight if missing)
  color?: string        // display color
  enabledMedications: string[]  // list of medication IDs active for this child
}
```

## Copii Tab UI

- List of child profile cards showing name, weight, height (if set)
- Button to add new child (opens form dialog)
- Each card has edit and delete buttons
- Add/Edit form fields: name, weight (kg), height (optional, cm)
- Active child selector — the selected child's doses appear in the Program and Medicamente tabs

## Medication toggle per child

In the child profile (or in a dedicated section), each medication can be toggled on/off for that child. Only toggled-on medications appear in that child's schedule and dose calculations.

## Persistence
All child profiles are stored in localStorage under a key like `"tratament-copii-children"`.
