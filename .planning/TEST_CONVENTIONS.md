# Test Conventions

## Where tests live
Co-located with the unit under test:
- `src/components/Foo.tsx` → `src/components/Foo.test.tsx`
- Pure logic (`src/lib/foo.ts`) → `src/lib/foo.test.ts`

## What to test
- Behavior and outputs, not implementation details.
- Components: rendered DOM + user interactions (`@testing-library/user-event`).
- Pure functions: inputs → outputs.

## What NOT to test
- Pixel positions, SVG path strings, font rendering, internal state.
- No snapshot tests for visual components (they are brittle across machines).

## TDD rhythm
1. Write failing test first.
2. Confirm it fails for the right reason.
3. Make it pass (minimum code).
4. Refactor while keeping green.

## Mocks & environment
- `localStorage` is real in jsdom — clear it in `beforeEach`.
- Use Vitest fake timers (`vi.useFakeTimers`) when code reads `Date.now()` or `new Date()`.
- Prefer real implementations over mocks when cheap.

## Running tests
- `npm run test` — single run (used in PR gate).
- `npm run test:watch` — for local TDD.
- `npm run test:ui` — Vitest UI.

## Coverage target (V1)
≥80% line coverage on **new** code introduced by each plan. Not blanket coverage on legacy.

Keep tests fast and focused.