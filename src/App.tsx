import { useEffect, useState } from 'react'
import { FlowProtoB } from './components/design/FlowProtoB'
import { ImportGate } from './components/design/share/ImportGate'
import { HomeEdi } from './components/design/variants/HomeEdi'
import { HomeFane } from './components/design/variants/HomeFane'
import { Fir } from './lab/Fir'
import { Grafic } from './lab/Grafic'
import { SkinBar } from './components/design/SkinBar'
import { loadLook, saveLook, type LookId } from './components/design/looks'
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
  const [look, setLook] = useState<LookId>(loadLook)
  const [skinsOpen, setSkinsOpen] = useState(false)

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
    setSkinsOpen(false)
  }

  function selectLook(next: LookId) {
    saveLook(next)
    setLook(next)
    setSkinsOpen(false)
  }

  const screen =
    variant === 'edi' ? (
      <HomeEdi />
    ) : variant === 'fane' ? (
      <HomeFane />
    ) : variant === 'lab' ? (
      <Fir />
    ) : variant === 'grafic' ? (
      <Grafic />
    ) : (
      <FlowProtoB />
    )

  return (
    <div className="stage">
      <div className="phone-frame">
        <div
          className="phone-inner"
          data-look={look === 'grec' ? undefined : look}
          data-skin={skin === 'grec' ? undefined : skin}
        >
          <LabBar
            variant={variant}
            onSelect={selectVariant}
            skinsOpen={skinsOpen}
            onToggleSkins={() => setSkinsOpen((open) => !open)}
          />
          {skinsOpen && <SkinBar look={look} skin={skin} onSelectLook={selectLook} onSelect={selectSkin} />}
          <div className="lab-screen">
            <ImportGate>{screen}</ImportGate>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
