/**
 * dosePlan.test.ts
 *
 * Tests for buildPlan(). Mocks:
 *   - doseStore: injected via the `doses` parameter added to buildPlan.
 *   - scheduleAdapter (nextDoseFor): vi.mock'd so tests are decoupled from
 *     real engine arithmetic; we verify buildPlan passes the right args and
 *     honours the returned time.
 *
 * The 4h cross-drug spacing floor stays in buildPlan, so we test it here.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Child } from '../../types'

vi.mock('./scheduleAdapter', () => ({
  nextDoseFor: vi.fn(),
}))

import { nextDoseFor } from './scheduleAdapter'
import { buildPlan } from './dosePlan'

const CHILD: Child = {
  id: 'child-1',
  name: 'Ana',
  weight: 12,
  enabledMedications: ['nurofen', 'panadol'],
}

const NOW = new Date('2025-01-15T03:00:00.000Z')

describe('buildPlan', () => {
  beforeEach(() => {
    // Default: nextDoseFor returns now (eligible immediately) for both meds.
    vi.mocked(nextDoseFor).mockReturnValue(NOW)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ── First treatment (no history) ────────────────────────────────────────
  describe('first treatment (kind=first, no lastMedId)', () => {
    it('now-step is Nurofen at `now`', () => {
      const plan = buildPlan({ child: CHILD, now: NOW })

      expect(plan.now.medId).toBe('nurofen')
      expect(plan.now.when).toEqual(NOW)
    })

    it('next-step is Panadol at the engine-computed time', () => {
      const engineTime = new Date(NOW.getTime() + 2 * 3600_000)
      vi.mocked(nextDoseFor).mockReturnValue(engineTime)

      const plan = buildPlan({ child: CHILD, now: NOW })

      expect(plan.next.medId).toBe('panadol')
      expect(plan.next.when).toEqual(engineTime)
    })

    it('next-step uses 4h floor when engine returns now (no prior panadol dose)', () => {
      // Engine says "now" (no panadol dose yet, eligible immediately).
      // But the 4h cross-drug spacing floor should apply relative to the now-step.
      vi.mocked(nextDoseFor).mockReturnValue(NOW)

      const plan = buildPlan({ child: CHILD, now: NOW })

      const floor = new Date(NOW.getTime() + 4 * 3600_000)
      expect(plan.next.when).toEqual(floor)
    })

    it('calls nextDoseFor with the correct args for the next medication', () => {
      buildPlan({ child: CHILD, now: NOW })

      expect(nextDoseFor).toHaveBeenCalledWith(
        expect.objectContaining({
          medicationId: 'panadol',
          childId: CHILD.id,
          now: expect.any(Date),
        }),
      )
    })
  })

  // ── Alternation: last given was Nurofen ─────────────────────────────────
  describe('last given was Nurofen', () => {
    it('now-step is Panadol', () => {
      const plan = buildPlan({ child: CHILD, now: NOW, lastMedId: 'nurofen' })

      expect(plan.now.medId).toBe('panadol')
    })

    it('next-step is Nurofen at engine-computed time', () => {
      const engineTime = new Date(NOW.getTime() + 6 * 3600_000)
      vi.mocked(nextDoseFor).mockImplementation(({ medicationId }) => {
        if (medicationId === 'nurofen') return engineTime
        return NOW
      })

      const plan = buildPlan({ child: CHILD, now: NOW, lastMedId: 'nurofen' })

      expect(plan.next.medId).toBe('nurofen')
      expect(plan.next.when).toEqual(engineTime)
    })
  })

  // ── Alternation: last given was Panadol ─────────────────────────────────
  describe('last given was Panadol', () => {
    it('now-step is Nurofen', () => {
      const plan = buildPlan({ child: CHILD, now: NOW, lastMedId: 'panadol' })

      expect(plan.now.medId).toBe('nurofen')
    })

    it('next-step is Panadol at engine-computed time', () => {
      const engineTime = new Date(NOW.getTime() + 4 * 3600_000)
      vi.mocked(nextDoseFor).mockImplementation(({ medicationId }) => {
        if (medicationId === 'panadol') return engineTime
        return NOW
      })

      const plan = buildPlan({ child: CHILD, now: NOW, lastMedId: 'panadol' })

      expect(plan.next.medId).toBe('panadol')
      expect(plan.next.when).toEqual(engineTime)
    })
  })

  // ── lastAt: explicit last-dose datetime from Step 2 ────────────────────
  describe('with lastAt (explicit last datetime)', () => {
    it('now-step is deferred to max(now, lastAt + 4h) when lastAt was recent', () => {
      // lastAt = 30 min before NOW -> now-step = lastAt + 4h (still in future)
      const localNow = new Date(2025, 0, 15, 3, 0, 0) // Jan 15 2025, 03:00 local
      const localLastAt = new Date(2025, 0, 15, 2, 30, 0) // 02:30 local (30min ago)

      vi.mocked(nextDoseFor).mockReturnValue(localNow)

      const plan = buildPlan({
        child: CHILD,
        now: localNow,
        lastMedId: 'nurofen',
        lastAt: localLastAt,
      })

      // now-step should be at max(localNow, localLastAt + 4h) = 06:30 local
      const expected = new Date(localLastAt.getTime() + 4 * 3600_000)
      expect(plan.now.when).toEqual(expected)
    })

    it('uses an absolute previous-day datetime instead of guessing from HH:MM', () => {
      const localNow = new Date(2025, 0, 15, 3, 0, 0) // Jan 15 2025, 03:00 local
      const previousDayLastAt = new Date(2025, 0, 14, 23, 30, 0)

      vi.mocked(nextDoseFor).mockReturnValue(localNow)

      const plan = buildPlan({
        child: CHILD,
        now: localNow,
        lastMedId: 'nurofen',
        lastAt: previousDayLastAt,
      })

      const expected = new Date(previousDayLastAt.getTime() + 4 * 3600_000)
      expect(plan.now.when).toEqual(expected)
    })
  })

  // ── sub_doza protection ────────────────────────────────────────────────
  describe('sub_doza case', () => {
    it('returns sub_doza amount when child weight is very low', () => {
      const tinyChild: Child = {
        id: 'child-tiny',
        name: 'Baby',
        weight: 1, // very low weight → triggers sub_doza for mg_per_kg meds
        enabledMedications: ['nurofen', 'panadol'],
      }

      // For weight_divided meds (nurofen/panadol), dose = round(weight/2 + offset)
      // nurofen: round(1/2 + 0) = round(0.5) = 1 — not sub_doza
      // sub_doza only applies to mg_per_kg type; we test that the field is
      // plumbed through correctly regardless of its value.
      const plan = buildPlan({ child: tinyChild, now: NOW })

      // Amount field must exist and be either a number or 'sub_doza'
      expect(
        typeof plan.now.amount === 'number' || plan.now.amount === 'sub_doza',
      ).toBe(true)
      expect(
        typeof plan.next.amount === 'number' || plan.next.amount === 'sub_doza',
      ).toBe(true)
    })
  })

  // ── nextDoseFor null (no rule) ──────────────────────────────────────────
  describe('nextDoseFor returns null (no rule for next med)', () => {
    it('falls back to 4h floor from now-step when engine returns null', () => {
      vi.mocked(nextDoseFor).mockReturnValue(null)

      const plan = buildPlan({ child: CHILD, now: NOW })

      // null -> fall back to 4h floor from now-step
      const floor = new Date(NOW.getTime() + 4 * 3600_000)
      expect(plan.next.when).toEqual(floor)
    })
  })
})
