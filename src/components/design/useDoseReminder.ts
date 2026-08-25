import { useEffect, useState } from 'react'
import {
  armReminder,
  ensureNotificationPermission,
  loadRemindersEnabled,
  saveRemindersEnabled,
  type Reminder,
} from './reminders'

export function useDoseReminder(reminder: Reminder | null) {
  const [enabled, setEnabled] = useState(loadRemindersEnabled)

  useEffect(() => {
    if (!enabled) {
      armReminder(null)
      return
    }
    armReminder(reminder)
    return () => armReminder(null)
  }, [enabled, reminder?.at.getTime(), reminder?.title, reminder?.body])

  async function enable() {
    const ok = await ensureNotificationPermission()
    if (!ok) return false
    saveRemindersEnabled(true)
    setEnabled(true)
    return true
  }

  function disable() {
    saveRemindersEnabled(false)
    setEnabled(false)
    armReminder(null)
  }

  return { enabled, enable, disable }
}
