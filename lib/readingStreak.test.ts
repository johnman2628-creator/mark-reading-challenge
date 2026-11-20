import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  compareEncouragementPeerEntries,
  computeHongKongBestReadingStreak,
  computeHongKongReadingStreak,
  didStartOrRestartHongKongReadingThisWeek,
  EncouragementPeerEntry,
  hasHongKongProgressOnDate,
  summarizeEncouragementCommunityStats,
} from './readingStreak'
import {
  AFTER_READING_ENCOURAGEMENTS,
  personalProgressEncouragementLines,
  personalProgressRestartCopy,
} from './encouragementCopy'

/**
 * Noon in Hong Kong, safely inside the given calendar date.
 *
 * @param isoDate - `YYYY-MM-DD`
 */
function hkNoon(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00+08:00`)
}

test('current streak is consecutive days ending today; a gap zeroes it', () => {
  const today = '2026-11-12'
  const readAts = [
    hkNoon('2026-11-10'),
    hkNoon('2026-11-11'),
    hkNoon('2026-11-12'),
  ]

  assert.equal(computeHongKongReadingStreak(readAts, today), 3)
  assert.equal(computeHongKongReadingStreak(readAts, '2026-11-13'), 0)
})

test('current streak ignores yesterday-only runs (missed today)', () => {
  const today = '2026-11-12'
  const readAts = [hkNoon('2026-11-09'), hkNoon('2026-11-10'), hkNoon('2026-11-11')]

  assert.equal(computeHongKongReadingStreak(readAts, today), 0)
})

test('best streak is 0 with no progress', () => {
  assert.equal(computeHongKongBestReadingStreak([]), 0)
})

test('best streak counts a single day as 1', () => {
  assert.equal(computeHongKongBestReadingStreak([hkNoon('2026-11-06')]), 1)
})

test('best streak counts same-day duplicates once', () => {
  const readAts = [
    new Date('2026-11-06T08:00:00+08:00'),
    new Date('2026-11-06T22:00:00+08:00'),
  ]
  assert.equal(computeHongKongBestReadingStreak(readAts), 1)
})

test('best streak keeps the longest historical run after a later gap', () => {
  const readAts = [
    hkNoon('2026-11-06'),
    hkNoon('2026-11-07'),
    hkNoon('2026-11-08'),
    hkNoon('2026-11-09'),
    hkNoon('2026-11-10'),
    // missed 11 Nov
    hkNoon('2026-11-12'),
  ]

  assert.equal(computeHongKongBestReadingStreak(readAts), 5)
  assert.equal(computeHongKongReadingStreak(readAts, '2026-11-12'), 1)
})

test('best streak uses the later run when it is longer', () => {
  const readAts = [
    hkNoon('2026-11-01'),
    hkNoon('2026-11-02'),
    hkNoon('2026-11-04'),
    hkNoon('2026-11-05'),
    hkNoon('2026-11-06'),
    hkNoon('2026-11-07'),
  ]

  assert.equal(computeHongKongBestReadingStreak(readAts), 4)
})

test('best streak is independent of timestamp order', () => {
  const readAts = [
    hkNoon('2026-11-08'),
    hkNoon('2026-11-06'),
    hkNoon('2026-11-07'),
  ]

  assert.equal(computeHongKongBestReadingStreak(readAts), 3)
})

test('best streak spans the year boundary', () => {
  const readAts = [
    hkNoon('2025-12-30'),
    hkNoon('2025-12-31'),
    hkNoon('2026-01-01'),
  ]

  assert.equal(computeHongKongBestReadingStreak(readAts), 3)
})

test('同行榜 ranks by best streak, then days completed, then nickname', () => {
  const entries: EncouragementPeerEntry[] = [
    { nickname: '甲同行者', daysCompleted: 20, bestStreak: 3, isYou: false },
    { nickname: '乙同行者', daysCompleted: 8, bestStreak: 8, isYou: true },
    { nickname: '丙同行者', daysCompleted: 10, bestStreak: 8, isYou: false },
    { nickname: '丁同行者', daysCompleted: 12, bestStreak: 0, isYou: false },
  ]

  const ranked = [...entries].sort(compareEncouragementPeerEntries)

  assert.deepEqual(
    ranked.map((entry) => entry.nickname),
    ['丙同行者', '乙同行者', '甲同行者', '丁同行者']
  )
})

/**
 * Saturday 21 Nov 2026: Hong Kong week Monday is 16 Nov.
 * Matches the live-app context around day 16 of a plan that started 6 Nov.
 */
const SATURDAY = '2026-11-21'

test('today-reader uses the Hong Kong calendar date of readAt, not UTC date', () => {
  const justAfterMidnightHk = new Date('2026-11-20T16:00:00.000Z') // 21 Nov 00:00 HKT
  const justBeforeMidnightHk = new Date('2026-11-20T15:59:00.000Z') // 20 Nov 23:59 HKT

  assert.equal(hasHongKongProgressOnDate([justAfterMidnightHk], SATURDAY), true)
  assert.equal(hasHongKongProgressOnDate([justBeforeMidnightHk], SATURDAY), false)
})

test('today-reader counts same-day duplicates once for that person', () => {
  const readAts = [
    new Date('2026-11-21T08:00:00+08:00'),
    new Date('2026-11-21T22:00:00+08:00'),
  ]
  assert.equal(hasHongKongProgressOnDate(readAts, SATURDAY), true)
})

test('restart this week: missed a day then read again Monday–today', () => {
  // Read 6–8 Nov, gap, then came back Friday this week.
  const readAts = [
    hkNoon('2026-11-06'),
    hkNoon('2026-11-07'),
    hkNoon('2026-11-08'),
    hkNoon('2026-11-20'),
  ]
  assert.equal(didStartOrRestartHongKongReadingThisWeek(readAts, SATURDAY), true)
})

test('restart this week: missed Sunday then read Monday', () => {
  const readAts = [hkNoon('2026-11-14'), hkNoon('2026-11-16')]
  assert.equal(didStartOrRestartHongKongReadingThisWeek(readAts, SATURDAY), true)
})

test('continuation from last week is not a restart', () => {
  // Sunday 15 Nov through Saturday 21 Nov — unbroken into this week.
  const readAts = [
    hkNoon('2026-11-15'),
    hkNoon('2026-11-16'),
    hkNoon('2026-11-17'),
    hkNoon('2026-11-18'),
    hkNoon('2026-11-19'),
    hkNoon('2026-11-20'),
    hkNoon('2026-11-21'),
  ]
  assert.equal(didStartOrRestartHongKongReadingThisWeek(readAts, SATURDAY), false)
})

test('first-time reader this week counts as 第一次讀', () => {
  assert.equal(
    didStartOrRestartHongKongReadingThisWeek([hkNoon('2026-11-21')], SATURDAY),
    true
  )
})

test('first-time reader last week who did not read this week is not counted', () => {
  assert.equal(
    didStartOrRestartHongKongReadingThisWeek([hkNoon('2026-11-10')], SATURDAY),
    false
  )
})

test('gap last week with no reading this week is not a restart this week', () => {
  const readAts = [hkNoon('2026-11-06'), hkNoon('2026-11-08'), hkNoon('2026-11-12')]
  assert.equal(didStartOrRestartHongKongReadingThisWeek(readAts, SATURDAY), false)
})

test('missed a day mid-week then read again still counts as restart', () => {
  // Started Monday, missed Tuesday, read Wednesday.
  const readAts = [hkNoon('2026-11-16'), hkNoon('2026-11-18')]
  assert.equal(didStartOrRestartHongKongReadingThisWeek(readAts, SATURDAY), true)
})

test('restart uses Hong Kong dates when the UTC date differs', () => {
  // 16 Nov 00:00 HKT is still Sunday 15 Nov in UTC.
  const mondayHkMidnight = new Date('2026-11-15T16:00:00.000Z')
  const earlierGap = hkNoon('2026-11-10')
  assert.equal(
    didStartOrRestartHongKongReadingThisWeek([earlierGap, mondayHkMidnight], SATURDAY),
    true
  )
})

test('on Monday, the week is only today', () => {
  const monday = '2026-11-16'
  assert.equal(
    didStartOrRestartHongKongReadingThisWeek([hkNoon('2026-11-16')], monday),
    true
  )
  assert.equal(
    didStartOrRestartHongKongReadingThisWeek([hkNoon('2026-11-15')], monday),
    false
  )
  // Sunday + Monday consecutive: continuation, not restart.
  assert.equal(
    didStartOrRestartHongKongReadingThisWeek(
      [hkNoon('2026-11-15'), hkNoon('2026-11-16')],
      monday
    ),
    false
  )
})

test('community stats count distinct people for today and this-week start/restart', () => {
  const todayReaderRestarted = [
    hkNoon('2026-11-06'),
    hkNoon('2026-11-21'),
  ]
  const todayFirstTimer = [hkNoon('2026-11-21')]
  const continuation = [
    hkNoon('2026-11-15'),
    hkNoon('2026-11-16'),
    hkNoon('2026-11-17'),
    hkNoon('2026-11-18'),
    hkNoon('2026-11-19'),
    hkNoon('2026-11-20'),
    hkNoon('2026-11-21'),
  ]
  const restartEarlierThisWeekNotToday = [hkNoon('2026-11-08'), hkNoon('2026-11-18')]
  const silentThisWeek = [hkNoon('2026-11-10')]

  assert.deepEqual(
    summarizeEncouragementCommunityStats(
      [
        todayReaderRestarted,
        todayFirstTimer,
        continuation,
        restartEarlierThisWeekNotToday,
        silentThisWeek,
      ],
      SATURDAY
    ),
    { readersTodayCount: 3, restartedThisWeekCount: 3 }
  )
})

test('community stats are zero when nobody has progress this week', () => {
  assert.deepEqual(
    summarizeEncouragementCommunityStats(
      [[hkNoon('2026-11-06')], [hkNoon('2026-11-12')]],
      SATURDAY
    ),
    { readersTodayCount: 0, restartedThisWeekCount: 0 }
  )
})

test('personal progress copy is warmer after a gap, and thanks the reader who already read today', () => {
  assert.match(
    personalProgressRestartCopy(false),
    /斷咗唔緊要.*新嘅開始.*已經完成嘅日子仍然記念你/
  )
  assert.match(
    personalProgressRestartCopy(true),
    /今日你已經讀過喇.*新嘅開始.*已經完成嘅日子仍然記念你/
  )
})

test('personal progress card includes pastor mottos and the restart line', () => {
  const lines = personalProgressEncouragementLines(false)
  assert.equal(lines[0], '微步大成功！')
  assert.equal(lines[1], '重點不是讀幾多，而是享受多～')
  assert.equal(lines[2], personalProgressRestartCopy(false))
})

test('after-reading pool includes the pastor lines and has no 僕人 phrasing', () => {
  const expected = [
    '主真的最欣賞你㗎！',
    '讀完有啲向主回應都好㗎～',
    '聖靈會透過神的話幫助你～',
    '多一次！多一次！信心上升～',
  ]
  const pool: readonly string[] = AFTER_READING_ENCOURAGEMENTS
  for (const line of expected) {
    assert.ok(pool.includes(line), `missing after-reading line: ${line}`)
  }
  for (const line of AFTER_READING_ENCOURAGEMENTS) {
    assert.equal(line.includes('僕人'), false, line)
  }
})
