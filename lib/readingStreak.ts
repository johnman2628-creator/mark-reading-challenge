import {
  addCalendarDaysIso,
  getHongKongDateIsoFromReadAt,
  getHongKongTodayIso,
} from '@/lib/plan'

/**
 * Consecutive calendar days (Asia/Hong_Kong) with logged progress, ending today.
 */
export function computeHongKongReadingStreak(readAts: Date[], todayIso = getHongKongTodayIso()): number {
  const datesWithProgress = new Set(
    readAts.map((readAt) => getHongKongDateIsoFromReadAt(readAt))
  )

  let streak = 0
  let checkDateIso = todayIso

  while (datesWithProgress.has(checkDateIso)) {
    streak++
    checkDateIso = addCalendarDaysIso(checkDateIso, -1)
  }

  return streak
}

export type EncouragementPeerEntry = {
  nickname: string
  daysCompleted: number
  streak: number
  isYou: boolean
}

export type EncouragementPeerBoard = {
  entries: EncouragementPeerEntry[]
}
