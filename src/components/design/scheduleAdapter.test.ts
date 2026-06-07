import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { AdministeredDose } from '../../types'

// We inject the doseStore dependency so tests don't touch localStorage.
// scheduleAdapter exports nextDoseFor; we'll vi.mock doseStore below.

vi.mock('./doseStore', () => ({
  doseStore: {
    listFor: vi.fn(),
  },
}))

import { doseStore } from './doseStore'
import { nextDoseFor } from './scheduleAdapter'

const CHILD_ID = 'child-1'
const NOW = new Date('2025-01-15T03:00:00.000Z')

function makeDose(medicationId: string, administeredAt: Date): AdministeredDose {
  return {
    id: 'd1',
    childId: CHILD_ID,
    medicationId,
    scheduledAt: administeredAt.toISOString(),
    administeredAt: administeredAt.toISOString(),
  }
}

describe('nextDoseFor', () => {
  beforeEach(() => {
    vi.mocked(doseStore.listFor).mockReturnValue([])
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns now when there are no administered doses (first treatment, eligible immediately)', () => {
    vi.mocked(doseStore.listFor).mockReturnValue([])

    const result = nextDoseFor({ medicationId: 'nurofen', childId: CHILD_ID, now: NOW })

    expect(result).toEqual(NOW)
  })

  it('returns lastAdministeredAt + 8h for nurofen given 30 min ago (not yet elapsed)', () => {
    const thirtyMinAgo = new Date(NOW.getTime() - 30 * 60_000)
    vi.mocked(doseStore.listFor).mockReturnValue([
      makeDose('nurofen', thirtyMinAgo),
    ])

    const result = nextDoseFor({ medicationId: 'nurofen', childId: CHILD_ID, now: NOW })

    // Nurofen rule: every 8h. Next dose = thirtyMinAgo + 8h
    const expected = new Date(thirtyMinAgo.getTime() + 8 * 3600_000)
    expect(result).toEqual(expected)
    // Must be in the future (30 min into the 8h window)
    expect(result!.getTime()).toBeGreaterThan(NOW.getTime())
  })

  it('returns lastAdministeredAt + 6h for panadol given 30 min ago (not yet elapsed)', () => {
    const thirtyMinAgo = new Date(NOW.getTime() - 30 * 60_000)
    vi.mocked(doseStore.listFor).mockReturnValue([
      makeDose('panadol', thirtyMinAgo),
    ])

    const result = nextDoseFor({ medicationId: 'panadol', childId: CHILD_ID, now: NOW })

    // Panadol rule: every 6h. Next dose = thirtyMinAgo + 6h
    const expected = new Date(thirtyMinAgo.getTime() + 6 * 3600_000)
    expect(result).toEqual(expected)
    expect(result!.getTime()).toBeGreaterThan(NOW.getTime())
  })

  it('returns now when nurofen interval has already elapsed (8h+ ago)', () => {
    const nineHoursAgo = new Date(NOW.getTime() - 9 * 3600_000)
    vi.mocked(doseStore.listFor).mockReturnValue([
      makeDose('nurofen', nineHoursAgo),
    ])

    const result = nextDoseFor({ medicationId: 'nurofen', childId: CHILD_ID, now: NOW })

    // Engine says next at nineHoursAgo + 8h = 1h ago, but max(that, now) = now
    expect(result).toEqual(NOW)
  })

  it('returns now when panadol interval has already elapsed (6h+ ago)', () => {
    const sevenHoursAgo = new Date(NOW.getTime() - 7 * 3600_000)
    vi.mocked(doseStore.listFor).mockReturnValue([
      makeDose('panadol', sevenHoursAgo),
    ])

    const result = nextDoseFor({ medicationId: 'panadol', childId: CHILD_ID, now: NOW })

    expect(result).toEqual(NOW)
  })

  it('uses the most recent administered dose when multiple doses exist', () => {
    const twoHoursAgo = new Date(NOW.getTime() - 2 * 3600_000)
    const tenHoursAgo = new Date(NOW.getTime() - 10 * 3600_000)
    vi.mocked(doseStore.listFor).mockReturnValue([
      makeDose('nurofen', tenHoursAgo),
      makeDose('nurofen', twoHoursAgo),
    ])

    const result = nextDoseFor({ medicationId: 'nurofen', childId: CHILD_ID, now: NOW })

    // Must use the most recent dose (2h ago), not the oldest
    const expected = new Date(twoHoursAgo.getTime() + 8 * 3600_000)
    expect(result).toEqual(expected)
    expect(result!.getTime()).toBeGreaterThan(NOW.getTime())
  })

  it('ignores doses of other medications when computing for nurofen', () => {
    const thirtyMinAgo = new Date(NOW.getTime() - 30 * 60_000)
    vi.mocked(doseStore.listFor).mockReturnValue([
      makeDose('panadol', thirtyMinAgo), // different med
    ])

    // No nurofen doses → eligible immediately
    const result = nextDoseFor({ medicationId: 'nurofen', childId: CHILD_ID, now: NOW })

    expect(result).toEqual(NOW)
  })

  it('returns null for an unknown medicationId that has no schedule rule', () => {
    vi.mocked(doseStore.listFor).mockReturnValue([])

    const result = nextDoseFor({ medicationId: 'unknown-med-xyz', childId: CHILD_ID, now: NOW })

    expect(result).toBeNull()
  })

  it('returns null for unknown med even when doses are present', () => {
    const oneHourAgo = new Date(NOW.getTime() - 3600_000)
    vi.mocked(doseStore.listFor).mockReturnValue([
      makeDose('unknown-med-xyz', oneHourAgo),
    ])

    const result = nextDoseFor({ medicationId: 'unknown-med-xyz', childId: CHILD_ID, now: NOW })

    expect(result).toBeNull()
  })

  it('passes childId to doseStore.listFor', () => {
    nextDoseFor({ medicationId: 'nurofen', childId: CHILD_ID, now: NOW })

    expect(doseStore.listFor).toHaveBeenCalledWith(CHILD_ID)
  })

  it('handles exactly-at-interval boundary: returns now (max applied)', () => {
    const exactlyEightHoursAgo = new Date(NOW.getTime() - 8 * 3600_000)
    vi.mocked(doseStore.listFor).mockReturnValue([
      makeDose('nurofen', exactlyEightHoursAgo),
    ])

    const result = nextDoseFor({ medicationId: 'nurofen', childId: CHILD_ID, now: NOW })

    // next slot = exactlyEightHoursAgo + 8h = NOW; max(NOW, NOW) = NOW
    expect(result).toEqual(NOW)
  })
})
