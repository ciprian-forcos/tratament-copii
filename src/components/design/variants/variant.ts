export type DesignVariant = 'acum' | 'edi' | 'fane' | 'lab' | 'grafic'

export function readVariant(search: string): DesignVariant {
  const value = new URLSearchParams(search).get('v')
  if (value === 'edi' || value === 'fane' || value === 'lab' || value === 'grafic') return value
  return 'acum'
}

export function variantHref(variant: DesignVariant): string {
  const params = new URLSearchParams(window.location.search)
  if (variant === 'acum') params.delete('v')
  else params.set('v', variant)
  const q = params.toString()
  return q ? `${window.location.pathname}?${q}` : window.location.pathname
}
