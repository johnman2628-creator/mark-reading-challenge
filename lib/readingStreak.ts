import {
  addCalendarDaysIso,
  getHongKongDateIsoFromReadAt,
  getHongKongTodayIso,
  getHongKongWeekMondayIso,
  isHongKongDateInCurrentWeek,
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

/**
 * Whether any progress timestamp falls on this Hong Kong calendar date.
 *
 * @param readAts - Progress timestamps (any order; same-day duplicates count once)
 * @param dateIso - Hong Kong calendar date `YYYY-MM-DD`
 */
export function hasHongKongProgressOnDate(
  readAts: Date[],
  dateIso: string
): boolean {
  return uniqueHongKongProgressDates(readAts).includes(dateIso)
}

/**
 * Whether this reader started or restarted in the current Hong Kong week.
 *
 * A restart (or first start) is a progress date `D` from 星期一 through today
 * whose previous calendar day has no progress — a missed day, then a later
 * reading this week. First-time readers whose first date is this week match
 * the same rule, so the count stays encouraging without being empty.
 *
 * @param readAts - Progress timestamps (any order; same-day duplicates count once)
 * @param todayIso - Hong Kong calendar date to treat as today
 * @returns True if they began or came back this week (Monday through today)
 * @note Someone reading every day from last week into this week is a continuation,
 * not a restart: Monday's previous day (Sunday) already has progress.
 */
export function didStartOrRestartHongKongReadingThisWeek(
  readAts: Date[],
  todayIso = getHongKongTodayIso()
): boolean {
  const datesWithProgress = new Set(uniqueHongKongProgressDates(readAts))
  const weekMondayIso = getHongKongWeekMondayIso(todayIso)

  for (const dateIso of datesWithProgress) {
    if (!isHongKongDateInCurrentWeek(dateIso, todayIso, weekMondayIso)) {
      continue
    }

    const previousDateIso = addCalendarDaysIso(dateIso, -1)
    if (!datesWithProgress.has(previousDateIso)) {
      return true
    }
  }

  return false
}

export type EncouragementCommunityStats = {
  /** Distinct fellow readers with progress on Hong Kong today. */
  readersTodayCount: number
  /**
   * Distinct fellow readers who started or restarted this Hong Kong week
   * (星期一 through today).
   */
  restartedThisWeekCount: number
}

/**
 * Count today-readers and this-week start/restarts from each person's `readAt`s.
 *
 * @param participantsReadAts - One `Date[]` of progress timestamps per reader
 * @param todayIso - Hong Kong calendar date to treat as today
 */
export function summarizeEncouragementCommunityStats(
  participantsReadAts: Date[][],
  todayIso = getHongKongTodayIso()
): EncouragementCommunityStats {
  let readersTodayCount = 0
  let restartedThisWeekCount = 0

  for (const readAts of participantsReadAts) {
    if (hasHongKongProgressOnDate(readAts, todayIso)) {
      readersTodayCount++
    }
    if (didStartOrRestartHongKongReadingThisWeek(readAts, todayIso)) {
      restartedThisWeekCount++
    }
  }

  return { readersTodayCount, restartedThisWeekCount }
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
} & EncouragementCommunityStats

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
