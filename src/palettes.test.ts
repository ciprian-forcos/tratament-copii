/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/**
 * Every palette the Temă menu offers must stay readable at 3am.
 * Colours are read straight from the CSS so a new skin cannot skip this.
 */
const css = (file: string) => readFileSync(new URL(file, import.meta.url), 'utf8')

function tokens(block: string) {
  const out: Record<string, string> = {}
  for (const m of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)) out[m[1]] = m[2]
  return out
}

function palettes() {
  const root = css('index.css').match(/:root\s*\{([\s\S]*?)\}/)![1]
  const list: [string, Record<string, string>][] = [['grec', tokens(root)]]
  for (const file of ['looks.css', 'skins.css']) {
    for (const m of css(file).matchAll(/\[data-(?:look|skin)="(\w+)"\]\s*\{([\s\S]*?)\n\}/g)) {
      const t = tokens(m[2])
      if (t.bg) list.push([m[1], t])
    }
  }
  for (const m of css('night.css').matchAll(/\/\* night:(\w+) \*\/([\s\S]*?)\n {2}\}/g)) {
    list.push([`night-${m[1]}`, tokens(m[2])])
  }
  return list
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// [foreground, background, minimum, what it is]
const RULES: [string, string, number, string][] = [
  ['ink', 'bg', 4.5, 'body text'],
  ['ink-2', 'bg', 4.5, 'medicine names on the tape'],
  ['ink-3', 'bg', 3, 'the tape line and small labels'],
  ['accent', 'bg', 3, 'next-dose ring'],
  ['accent-2', 'bg', 4.5, 'dose amount text'],
  ['cool', 'bg', 3, 'given-dose mark'],
  ['on-accent', 'accent', 4.5, 'text on the Confirmă button'],
]

describe('palette readability', () => {
  const all = palettes()

  it('finds every look and skin', () => {
    expect(all.map(([id]) => id)).toEqual(
      expect.arrayContaining([
        'grec', 'material', 'sticla', 'mario', 'sonic', 'burete', 'dragon',
        'night-grec', 'night-material', 'night-sticla',
      ]),
    )
  })

  for (const [id, t] of all) {
    for (const [fg, bg, min, what] of RULES) {
      it(`${id}: ${what} (--${fg} on --${bg}) ≥ ${min}:1`, () => {
        expect(t[fg], `${id} is missing --${fg}`).toBeDefined()
        expect(contrast(t[fg], t[bg])).toBeGreaterThanOrEqual(min)
      })
    }
  }
})
