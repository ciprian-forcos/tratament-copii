/**
 * Pure merge helpers for the import flow.
 *
 * Both functions are side-effect-free: they take local and incoming arrays
 * and return a new merged array (and summary for children). Callers are
 * responsible for persisting the results.
 */

import type { Child, Medication } from '../../../types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MergeSummary {
  /** Names of children that were new (id not present locally). */
  added: string[]
  /** Names of children that differed from local and were overwritten. */
  updated: string[]
  /** Names of children that were identical after merge (no change). */
  unchanged: string[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Compare two children ignoring `temp`.
 * Used to decide whether to classify an id-matched child as "updated" vs
 * "unchanged" in the summary.
 */
function childEqualIgnoringTemp(a: Child, b: Child): boolean {
  const { temp: _ta, ...restA } = a
  const { temp: _tb, ...restB } = b
  return JSON.stringify(restA) === JSON.stringify(restB)
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Merge incoming children into the local list.
 *
 * Merge rules:
 *  - Match by `id`.
 *  - If id matches: incoming overwrites field-by-field, EXCEPT that the local
 *    `temp` value is preserved when the incoming child carries no `temp`
 *    (privacy: `temp` is stripped before encoding and must not be lost on the
 *    receiving device by overwriting with undefined).
 *  - If id is new: append after existing children.
 *  - Returns a MergeSummary listing child *names* in each category.
 *
 * Uses Maps for O(n) merging.
 */
export function mergeChildren(
  local: Child[],
  incoming: Child[],
): { merged: Child[]; summary: MergeSummary } {
  const localMap = new Map<string, Child>(local.map((c) => [c.id, c]))
  const summary: MergeSummary = { added: [], updated: [], unchanged: [] }

  // Start with a copy of locals, update in-place via the map
  const mergedMap = new Map<string, Child>(localMap)

  for (const inc of incoming) {
    const existing = localMap.get(inc.id)
    if (existing) {
      // Privacy rule: preserve local temp when incoming doesn't carry one.
      // temp is stripped by the encoder and should never overwrite a
      // locally-set measurement on the receiving device.
      const merged: Child = {
        ...existing,
        ...inc,
        temp: inc.temp !== undefined ? inc.temp : existing.temp,
      }
      mergedMap.set(inc.id, merged)

      // Summary classification: unchanged if no non-temp field changed
      if (childEqualIgnoringTemp(merged, existing)) {
        summary.unchanged.push(merged.name)
      } else {
        summary.updated.push(merged.name)
      }
    } else {
      // New id — append
      mergedMap.set(inc.id, inc)
      summary.added.push(inc.name)
    }
  }

  // Preserve local children that weren't in incoming as unchanged
  for (const loc of local) {
    if (!incoming.find((inc) => inc.id === loc.id)) {
      summary.unchanged.push(loc.name)
    }
  }

  // Output order: original local order first, then new arrivals appended
  const incomingIds = new Set(incoming.map((c) => c.id))
  const merged: Child[] = [
    ...local.map((c) => mergedMap.get(c.id)!),
    ...incoming.filter((c) => !localMap.has(c.id)),
  ]

  // Prevent duplicate reference: ensure no local id appears twice
  // (already handled above: local order preserved, new ones appended)
  void incomingIds

  return { merged, summary }
}

/**
 * Merge incoming medications into the local list.
 *
 * Same id-match strategy as mergeChildren: incoming overwrites, new ids append.
 * No summary (medications merge is silent — UI only shows child summary).
 */
export function mergeMedications(local: Medication[], incoming: Medication[]): Medication[] {
  const localMap = new Map<string, Medication>(local.map((m) => [m.id, m]))

  const mergedMap = new Map<string, Medication>(localMap)
  for (const inc of incoming) {
    mergedMap.set(inc.id, inc)
  }

  // Output: local order first, new arrivals appended
  const result: Medication[] = local.map((m) => mergedMap.get(m.id)!)
  for (const inc of incoming) {
    if (!localMap.has(inc.id)) {
      result.push(inc)
    }
  }

  return result
}
