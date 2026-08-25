export const REMINDERS_KEY = 'tratament-copii-reminders-enabled'

let armed: ReturnType<typeof setTimeout> | null = null

export function loadRemindersEnabled(): boolean {
  try {
    return window.localStorage.getItem(REMINDERS_KEY) === 'true'
  } catch {
    return false
  }
}

export function saveRemindersEnabled(enabled: boolean) {
  try {
    window.localStorage.setItem(REMINDERS_KEY, enabled ? 'true' : 'false')
  } catch {
    /* ignore */
  }
}

export async function ensureNotificationPermission(): Promise<boolean> {
  if (typeof Notification === 'undefined') return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export type Reminder = {
  at: Date
  title: string
  body: string
}

export async function showDoseNotification(reminder: Reminder) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
  const ready = navigator.serviceWorker?.ready
  const reg = ready ? await ready.catch(() => undefined) : undefined
  if (reg?.showNotification) {
    await reg.showNotification(reminder.title, {
      body: reminder.body,
      tag: 'tratament-copii-dose',
    })
    return
  }
  new Notification(reminder.title, { body: reminder.body })
}

export function armReminder(reminder: Reminder | null) {
  if (armed != null) {
    clearTimeout(armed)
    armed = null
  }
  if (!reminder) return
  const delay = reminder.at.getTime() - Date.now()
  if (delay <= 0) {
    void showDoseNotification(reminder)
    return
  }
  if (delay > 2_000_000_000) return
  armed = setTimeout(() => {
    armed = null
    void showDoseNotification(reminder)
  }, delay)
}
