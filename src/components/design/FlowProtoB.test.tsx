import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { childStore } from './childStore'
import { doseStore } from './doseStore'
import { FlowProtoB } from './FlowProtoB'
import { savePanicPref } from './panicPref'
import { ImportGate } from './share/ImportGate'
import { encodeShare } from './share/encoder'
import type { SharePayload } from './share/types'
import { timelineStore } from './timeline/store'

beforeEach(() => {
  localStorage.clear()
  doseStore.clear()
  timelineStore.clear()
  timelineStore.reloadFromStorage()
  savePanicPref('on')
  window.history.pushState({}, '', '/')
  childStore.setState({
    children: [
      {
        id: 'maya',
        name: 'Maya',
        weight: 13,
        years: 2,
        months: 4,
        initial: 'M',
        temp: 38.5,
        enabledMedications: ['nurofen', 'panadol'],
      },
    ],
    activeId: 'maya',
  })
})

async function openDrawer(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /copii și medicamente/i }))
}

describe('FlowProtoB timeline home', () => {
  it('is the timeline even when panic pref is off', () => {
    savePanicPref('off')
    render(<FlowProtoB />)
    expect(screen.getByText('acum')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /tratament febră/i })).not.toBeInTheDocument()
  })

  it('shows child and medicine chips in the pull-down', async () => {
    const user = userEvent.setup()
    render(<FlowProtoB />)
    await openDrawer(user)
    expect(screen.getByRole('button', { name: /copil maya/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nurofen/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /panadol/i })).toBeInTheDocument()
  })

  it('toggles a medicine chip for the active child', async () => {
    const user = userEvent.setup()
    render(<FlowProtoB />)
    await openDrawer(user)
    const chip = screen.getByRole('button', { name: /nurofen/i })
    expect(chip).toHaveAttribute('aria-pressed', 'true')
    await user.click(chip)
    expect(chip).toHaveAttribute('aria-pressed', 'false')
  })

  it('shows imported medicines in the pull-down without a reload', async () => {
    const user = userEvent.setup()
    const payload: SharePayload = {
      v: 1,
      children: childStore.get().children,
      medications: [
        {
          id: 'imported-med',
          name: 'Import sirop',
          doseType: 'fixed',
          doseConfig: { type: 'fixed', amount: '5', unit: 'ml' },
          color: '#3b82f6',
          notes: '',
        },
      ],
      sentAt: new Date().toISOString(),
    }
    window.history.pushState({}, '', `?import=${encodeURIComponent(encodeShare(payload))}`)

    render(
      <ImportGate>
        <FlowProtoB />
      </ImportGate>,
    )

    await waitFor(() => screen.getByRole('button', { name: /^importă$/i }))
    await user.click(screen.getByRole('button', { name: /^importă$/i }))
    await openDrawer(user)

    expect(screen.getByRole('button', { name: /import sirop/i })).toBeInTheDocument()
  })
})
