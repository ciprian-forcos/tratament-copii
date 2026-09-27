import { LOOKS, type LookId } from './looks'
import { SKINS, type SkinId } from './skins'

export function SkinBar({
  look,
  skin,
  onSelectLook,
  onSelect,
}: {
  look: LookId
  skin: SkinId
  onSelectLook: (id: LookId) => void
  onSelect: (id: SkinId) => void
}) {
  return (
    <div id="skin-list" className="ui-panel" style={{ padding: '6px 8px 8px', flex: '0 0 auto' }}>
      <div className="eyebrow" style={{ margin: '4px 2px 6px' }}>
        Stil
      </div>
      <div role="radiogroup" aria-label="stil" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {LOOKS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            className="ui-btn"
            aria-checked={item.id === look}
            onClick={() => onSelectLook(item.id)}
            style={chip}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="eyebrow" style={{ margin: '10px 2px 6px' }}>
        Culori
      </div>
      <div role="tablist" aria-label="teme" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {SKINS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            className="ui-btn"
            aria-selected={item.id === skin}
            onClick={() => onSelect(item.id)}
            style={chip}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

const chip = { flex: '0 0 auto', minHeight: 44, padding: '6px 12px', fontSize: 13 }
