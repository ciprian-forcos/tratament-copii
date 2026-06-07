import { FlowProtoB } from './components/design/FlowProtoB'
import { ImportGate } from './components/design/share/ImportGate'

/**
 * App shell for design B (Plan tratament febră — B).
 *
 * The phone bezel is shown on desktop (>540px) via .stage / .phone-frame,
 * full-bleed on small screens. All app chrome lives inside .phone.
 */
function App() {
  return (
    <div className="stage">
      <div className="phone-frame">
        <div className="phone-inner">
          <ImportGate>
            <FlowProtoB />
          </ImportGate>
        </div>
      </div>
    </div>
  )
}

export default App
