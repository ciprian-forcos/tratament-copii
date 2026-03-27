# Scheduling & Treatment Program

## Purpose
The Program tab shows a timeline of when each medication should be administered, based on scheduling rules and a user-selected start time.

## Schedule Rule Types

Each rule links a medication to a timing pattern:

### every_n_hours
Repeat every N hours from the start time (or from last dose).
```ts
{ id: string, type: "every_n_hours", medicationId: string, everyNHours: number, isStartRule?: boolean }
```

### after_medication
Administer N hours after a specific other medication was given.
```ts
{ id: string, type: "after_medication", medicationId: string, afterMedicationId: string, hoursAfter: number }
```

### once_per_day
Once per day at a fixed time.
```ts
{ id: string, type: "once_per_day", medicationId: string }
```

### times_per_day
N times per day, evenly spaced.
```ts
{ id: string, type: "times_per_day", medicationId: string, timesPerDay: number }
```

## Default Rules

| id | type | medication | detail |
|----|------|-----------|--------|
| r1 | every_n_hours | nurofen | every 8h, isStartRule=true |
| r2 | after_medication | panadol | 3h after nurofen |
| r3 | every_n_hours | panadol | every 6h |
| r4 | every_n_hours | diclofenac | every 12h |
| r5 | every_n_hours | novocalmin | every 12h |
| r6 | once_per_day | vitamina_d | — |
| r7 | once_per_day | vitamina_c | — |
| r8 | times_per_day | virodep | 2x/day |
| r9 | times_per_day | greentus | 3x/day |

## Program Tab UI

- Date/time picker for treatment start time
- Timeline view: chronological list of upcoming doses over 24h (or configurable window)
- Each dose entry shows: time, medication name (with color), dose amount for active child
- Ability to mark a dose as "administered" (check it off)
- Visual distinction between past, current, and upcoming doses
- Child selector at the top (if multiple children)
- Rules management: ability to add/edit/delete scheduling rules

## Child-specific medication selection
Each child can have a subset of medications enabled/disabled. The schedule only shows medications that are enabled for the active child.
