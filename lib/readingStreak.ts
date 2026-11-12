import {
  addCalendarDaysIso,
  getHongKongDateIsoFromReadAt,
  getHongKongTodayIso,
} from '@/lib/plan'

/**
 * Unique Hong Kong calendar dates (`YYYY-MM-DD`) that have logged progress.
 *
 * @param readAts - Progress timestamps in any order
 * @returns Sorted unique dates (lexicographic ISO order matches calendar order)
 */
function uniqueHongKongProgressDates(readAts: Date[]): string[] {
  const datesWithProgress = new Set(
    readAts.map((readAt) => getHongKongDateIsoFromReadAt(readAt))
  )
  return [...datesWithProgress].sort()
}

/**
 * Consecutive calendar days (Asia/Hong_Kong) with logged progress, ending today.
 *
 * @param readAts - Progress timestamps (any order; same-day duplicates count once)
 * @param todayIso - Hong Kong calendar date to treat as today (`YYYY-MM-DD`)
 * @returns Live streak ending today; a missed day zeroes this value
 * @note This is the live “目前連續”, not the all-time highest record.
 */
export function computeHongKongReadingStreak(
  readAts: Date[],
  todayIso = getHongKongTodayIso()
): number {
  const datesWithProgress = new Set(uniqueHongKongProgressDates(readAts))

  let streak = 0
  let checkDateIso = todayIso

  while (datesWithProgress.has(checkDateIso)) {
    streak++
    checkDateIso = addCalendarDaysIso(checkDateIso, -1)
  }

  return streak
}

/**
 * Longest consecutive calendar-day run (Asia/Hong_Kong) with logged progress.
 *
 * @param readAts - Progress timestamps (any order; same-day duplicates count once)
 * @returns All-time highest streak record; 0 if there is no progress
 * @note A later missed day does not erase an earlier run. This is what 同行榜 ranks by.
 */
export function computeHongKongBestReadingStreak(readAts: Date[]): number {
  const sortedDates = uniqueHongKongProgressDates(readAts)

  if (sortedDates.length === 0) {
    return 0
  }

  let bestStreak = 1
  let currentRun = 1

  for (let index = 1; index < sortedDates.length; index++) {
    const previousDate = sortedDates[index - 1]
    const expectedPrevious = addCalendarDaysIso(sortedDates[index], -1)

    if (previousDate === expectedPrevious) {
      currentRun++
      if (currentRun > bestStreak) {
        bestStreak = currentRun
      }
    } else {
      currentRun = 1
    }
  }

  return bestStreak
}

export type EncouragementPeerEntry = {
  nickname: string
  daysCompleted: number
  /** All-time highest consecutive Hong Kong calendar-day streak. */
  bestStreak: number
  isYou: boolean
}

export type EncouragementPeerBoard = {
  entries: EncouragementPeerEntry[]
}

/**
 * Sort 同行榜 entries: highest record first, then days completed, then nickname.
 *
 * @param a - Left entry
 * @param b - Right entry
 * @returns Negative if `a` should appear before `b`
 */
export function compareEncouragementPeerEntries(
  a: EncouragementPeerEntry,
  b: EncouragementPeerEntry
): number {
  if (b.bestStreak !== a.bestStreak) {
    return b.bestStreak - a.bestStreak
  }
  if (b.daysCompleted !== a.daysCompleted) {
    return b.daysCompleted - a.daysCompleted
  }
  return a.nickname.localeCompare(b.nickname, 'zh-HK')
}
