import { useEffect, useState } from 'react'
import { FlowProtoB } from './components/design/FlowProtoB'
import { ImportGate } from './components/design/share/ImportGate'
import { HomeEdi } from './components/design/variants/HomeEdi'
import { HomeFane } from './components/design/variants/HomeFane'
import { SkinBar } from './components/design/SkinBar'
import { loadSkin, saveSkin, type SkinId } from './components/design/skins'
import { LabBar } from './components/design/variants/LabBar'
import { readVariant, variantHref, type DesignVariant } from './components/design/variants/variant'

/**
 * App shell for design B (Plan tratament febră — B).
 *
 * The phone bezel is shown on desktop (>540px) via .stage / .phone-frame,
 * full-bleed on small screens. All app chrome lives inside .phone.
 */
function App() {
  const [variant, setVariant] = useState<DesignVariant>(() => readVariant(window.location.search))
  const [skin, setSkin] = useState<SkinId>(loadSkin)

  useEffect(() => {
    const sync = () => setVariant(readVariant(window.location.search))
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  function selectVariant(next: DesignVariant) {
    window.history.pushState({}, '', variantHref(next))
    setVariant(next)
  }

  function selectSkin(next: SkinId) {
    saveSkin(next)
    setSkin(next)
  }

  const screen =
    variant === 'edi' ? <HomeEdi /> : variant === 'fane' ? <HomeFane /> : <FlowProtoB />

  return (
    <div className="stage">
      <div className="phone-frame">
        <div className="phone-inner" data-skin={skin === 'grec' ? undefined : skin}>
          <LabBar variant={variant} onSelect={selectVariant} />
          <SkinBar skin={skin} onSelect={selectSkin} />
          <div className="lab-screen">
            <ImportGate>{screen}</ImportGate>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
