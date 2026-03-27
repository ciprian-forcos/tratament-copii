# No Duplicate Medications

## Requirement
In the Medicamente tab, it must be impossible to add a medication that already exists.

## Duplicate detection rules

A medication is considered a duplicate if **either** of these match (case-insensitive):
1. The `name` field exactly matches an existing medication's name (after trimming whitespace)
2. The `id` matches an existing medication's id

## UI behavior

### When adding a new medication
- As the user types in the name field, check in real time against existing medication names
- If a duplicate name is detected, show an inline validation error below the name field:
  `"Există deja un medicament cu acest nume."`
- The "Salvează" (Save) button must be disabled while a duplicate name error is present
- The error clears immediately when the name becomes unique again

### When editing an existing medication
- Same real-time validation applies, but exclude the medication being edited from the duplicate check (it's allowed to keep its own name)

## Acceptance criteria
- [ ] Cannot save a new medication with the same name as any existing one (case-insensitive)
- [ ] Inline error message appears while name is a duplicate
- [ ] Save button is disabled when name is a duplicate
- [ ] Editing a medication does not flag its own name as a duplicate
- [ ] Whitespace trimming: "  Nurofen  " is a duplicate of "Nurofen"
