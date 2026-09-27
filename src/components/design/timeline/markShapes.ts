/**
 * The next-dose ring as a 72-point outline in a 24×24 box centred on 0,0.
 * Looks may replace it in CSS with another 72-point outline (Material's
 * scalloped "cookie" in src/looks.css) so the browser can morph between them.
 */
export const NEXT_RING_PATH =
  'M0.00 -7.50 L0.65 -7.47 L1.30 -7.39 L1.94 -7.24 L2.57 -7.05 L3.17 -6.80 L3.75 -6.50 L4.30 -6.14 L4.82 -5.75 L5.30 -5.30 L5.75 -4.82 L6.14 -4.30 L6.50 -3.75 L6.80 -3.17 L7.05 -2.57 L7.24 -1.94 L7.39 -1.30 L7.47 -0.65 L7.50 0.00 L7.47 0.65 L7.39 1.30 L7.24 1.94 L7.05 2.57 L6.80 3.17 L6.50 3.75 L6.14 4.30 L5.75 4.82 L5.30 5.30 L4.82 5.75 L4.30 6.14 L3.75 6.50 L3.17 6.80 L2.57 7.05 L1.94 7.24 L1.30 7.39 L0.65 7.47 L0.00 7.50 L-0.65 7.47 L-1.30 7.39 L-1.94 7.24 L-2.57 7.05 L-3.17 6.80 L-3.75 6.50 L-4.30 6.14 L-4.82 5.75 L-5.30 5.30 L-5.75 4.82 L-6.14 4.30 L-6.50 3.75 L-6.80 3.17 L-7.05 2.57 L-7.24 1.94 L-7.39 1.30 L-7.47 0.65 L-7.50 0.00 L-7.47 -0.65 L-7.39 -1.30 L-7.24 -1.94 L-7.05 -2.57 L-6.80 -3.17 L-6.50 -3.75 L-6.14 -4.30 L-5.75 -4.82 L-5.30 -5.30 L-4.82 -5.75 L-4.30 -6.14 L-3.75 -6.50 L-3.17 -6.80 L-2.57 -7.05 L-1.94 -7.24 L-1.30 -7.39 L-0.65 -7.47 Z'

/** A given dose springs in only when it was confirmed this recently. */
export const FRESH_MARK_MS = 60_000
