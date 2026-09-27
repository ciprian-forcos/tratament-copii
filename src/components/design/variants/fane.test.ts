import { describe, expect, it } from 'vitest'
import { acumChip, dayTickLabel, dayTicks, splitAmount, stepAmount } from './fane'

describe('Fane tape helpers', () => {
  it('labels a midnight as Luni 5 sept', () => {
    expect(dayTickLabel(new Date(2026, 8, 7))).toBe('Luni 7 sept')
    expect(dayTickLabel(new Date(2026, 8, 5))).toBe('Sâmbătă 5 sept')
  })

  it('finds midnights inside the window', () => {
    const ticks = dayTicks(new Date(2026, 8, 4, 22, 0), new Date(2026, 8, 6, 3, 0))
    expect(ticks.map(dayTickLabel)).toEqual(['Sâmbătă 5 sept', 'Duminică 6 sept'])
  })

  it('asks for acum when now has left the screen', () => {
    expect(acumChip(-4)).toBe('<< acum')
    expect(acumChip(140)).toBe('acum >>')
    expect(acumChip(50)).toBeNull()
  })

  it('splits and steps a puff count', () => {
    expect(splitAmount('2 pufuri')).toEqual({ n: 2, unit: 'pufuri' })
    expect(stepAmount(2, 1)).toBe(3)
    expect(stepAmount(2, -1)).toBe(1)
    expect(stepAmount(0, -1)).toBe(0)
  })
})
