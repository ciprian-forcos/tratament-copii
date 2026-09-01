import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  armReminder,
  ensureNotificationPermission,
  loadRemindersEnabled,
  REMINDERS_KEY,
  saveRemindersEnabled,
} from './reminders'

const shown: { title: string; body?: string }[] = []

describe('reminders', () => {
  beforeEach(() => {
    shown.length = 0
    localStorage.clear()
    vi.useFakeTimers()
    class FakeNotification {
      static permission = 'granted'
      static requestPermission = vi.fn(async () => 'granted')
      constructor(title: string, opts?: NotificationOptions) {
        shown.push({ title, body: opts?.body })
      }
    }
    Object.defineProperty(window, 'Notification', {
      configurable: true,
      writable: true,
      value: FakeNotification,
    })
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: undefined,
    })
  })

  afterEach(() => {
    armReminder(null)
    vi.useRealTimers()
  })

  it('persists the enabled flag', () => {
    expect(loadRemindersEnabled()).toBe(false)
    saveRemindersEnabled(true)
    expect(localStorage.getItem(REMINDERS_KEY)).toBe('true')
    expect(loadRemindersEnabled()).toBe(true)
  })

  it('requests notification permission', async () => {
    expect(await ensureNotificationPermission()).toBe(true)
  })

  it('returns false when notification permission is denied', async () => {
    ;(window.Notification as unknown as { permission: string }).permission = 'denied'
    expect(await ensureNotificationPermission()).toBe(false)
  })

  it('fires when the due time is reached', () => {
    armReminder({
      at: new Date(Date.now() + 60_000),
      title: 'Tratament copii',
      body: 'Dă Nurofen',
    })
    expect(shown).toHaveLength(0)
    vi.advanceTimersByTime(60_000)
    expect(shown).toEqual([{ title: 'Tratament copii', body: 'Dă Nurofen' }])
  })
})
