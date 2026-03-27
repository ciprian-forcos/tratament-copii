# Medications

## Data Model

Each medication has:
- `id`: string (unique identifier)
- `name`: string (display name)
- `doseType`: one of `"weight_divided"` | `"mg_per_kg"` | `"weight_threshold"` | `"fixed"`
- `doseConfig`: object (type-specific, see below)
- `color`: hex color string
- `notes`: string (administration notes)

## Dose Types

### weight_divided
`dose = Math.round(weight / divisor + offset)` in the given unit.
```ts
{ type: "weight_divided", divisor: number, offset: number, unit: string }
```

### mg_per_kg
`dailyMg = min(mgPerKgPerDay * weight, maxDailyMg)`
`doseMg = dailyMg / dosesPerDay`
`doseAmount = round(doseMg / concentrationMg, roundTo)` — if < 0.25, show "Sub doza minima"
```ts
{ type: "mg_per_kg", mgPerKgPerDay: number, dosesPerDay: number, concentrationMg: number, unit: string, maxDailyMg?: number, roundTo: "whole" | "half" | "quarter" }
```

### fixed
Fixed amount regardless of weight.
```ts
{ type: "fixed", amount: string, unit: string }
```

### weight_threshold
Dose based on weight ranges (threshold table).
```ts
{ type: "weight_threshold", thresholds: Array<{ min: number, max?: number, amount: string }>, unit: string }
```

## Default Medications

The app ships with these 8 default medications:

| id | name | doseType | config | color | notes |
|----|------|----------|--------|-------|-------|
| nurofen | Nurofen/Algin (Ibuprofen 100mg/5ml) | weight_divided | divisor:2, offset:0, unit:"ml" | #3b82f6 | La 8 ore; min 2h de la Panadol daca febra persista |
| panadol | Panadol Baby (Paracetamol 24mg/ml) | weight_divided | divisor:2, offset:1, unit:"ml" | #f97316 | La 6 ore; min 2h de la Nurofen |
| diclofenac | Supozitor Diclofenac (12.5mg) | mg_per_kg | mgPerKgPerDay:1, dosesPerDay:2, concentrationMg:12.5, unit:"supozitor", maxDailyMg:150, roundTo:"whole" | #8b5cf6 | 0.5-2 mg/kg/zi, in 2-3 prize. Doar daca nu scade cu Nurofen+Panadol |
| novocalmin | Supozitor Novocalmin (12.5mg) | mg_per_kg | mgPerKgPerDay:1, dosesPerDay:2, concentrationMg:12.5, unit:"supozitor", maxDailyMg:150, roundTo:"whole" | #14b8a6 | 0.5-2 mg/kg/zi, in 2-3 prize. Doar daca nu scade cu Nurofen+Panadol |
| vitamina_d | Spray Vitamina D - Devit500 | fixed | amount:"2", unit:"pufuri" | #22c55e | O data pe zi |
| vitamina_c | Vitamina C (picaturi) | fixed | amount:"4", unit:"picaturi" | #eab308 | Dimineata |
| virodep | Virodep (picaturi) | fixed | amount:"11", unit:"picaturi" | #ec4899 | De 2 ori pe zi, inainte de masa |
| greentus | GreenTus Sirop | fixed | amount:"5", unit:"ml" | #ef4444 | De 3 ori pe zi, inainte de masa |

## UI — Medicamente Tab

- List all medications as cards showing name, dose formula result (for a selected/active child), color badge, and notes
- Button to add new medication (opens form dialog)
- Each medication card has edit and delete buttons
- Add/Edit form fields: name, dose type selector, dose config fields (dynamic based on type), color picker, notes

## Dose Calculation Helper
BSA (Mosteller formula): `BSA = sqrt(height_cm * weight_kg / 3600)`
Estimated height by age:
- ≤5kg: 55cm, ≤8kg: 65cm, ≤10kg: 75cm, ≤12kg: 85cm, ≤15kg: 95cm
- ≤18kg: 105cm, ≤22kg: 115cm, ≤28kg: 125cm, ≤35kg: 135cm, else: 145cm
