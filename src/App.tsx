import { useState } from 'react'
import { Calendar, Pill, Users, type LucideIcon } from 'lucide-react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { CopiiTab } from './components/CopiiTab'
import { MedicamenteTab } from './components/MedicamenteTab'
import { DEFAULT_MEDICATIONS } from './data/medications'
import type { Child, Medication } from './types'

type Tab = 'program' | 'medicamente' | 'copii'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('program')

  const [children, setChildren] = useLocalStorage<Child[]>('tratament-copii-children', [])
  const [activeChildId, setActiveChildId] = useLocalStorage<string | null>('tratament-copii-active-child', null)
  const [medications] = useLocalStorage<Medication[]>('tratament-copii-medications', DEFAULT_MEDICATIONS)

  const activeChild = children.find(c => c.id === activeChildId) ?? null

  const tabs: { id: Tab; label: string; Icon: LucideIcon }[] = [
    { id: 'program', label: 'Program', Icon: Calendar },
    { id: 'medicamente', label: 'Medicamente', Icon: Pill },
    { id: 'copii', label: 'Copii', Icon: Users },
  ]

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto bg-white shadow-sm">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-gray-900">Calculator Doze</h1>
        <button
          onClick={() => setActiveTab('copii')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            activeChild
              ? 'text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          style={activeChild ? { backgroundColor: activeChild.color ?? '#6366f1' } : undefined}
        >
          {activeChild ? activeChild.name : 'Selectează copil'}
        </button>
      </header>

      {/* Tab content */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'program' && (
          <div className="p-4 text-center mt-8 text-gray-400 text-sm">
            Programul de tratament va apărea aici.
          </div>
        )}
        {activeTab === 'medicamente' && (
          <MedicamenteTab
            medications={medications}
            activeChild={activeChild}
          />
        )}
        {activeTab === 'copii' && (
          <CopiiTab
            children={children}
            setChildren={setChildren}
            activeChildId={activeChildId}
            setActiveChildId={setActiveChildId}
            medications={medications}
          />
        )}
      </main>

      {/* Bottom navigation */}
      <nav className="flex border-t bg-white sticky bottom-0 z-10">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col items-center py-2 gap-1 text-xs font-medium transition-colors ${
              activeTab === id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
