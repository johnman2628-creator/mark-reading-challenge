import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  compareEncouragementPeerEntries,
  computeHongKongBestReadingStreak,
  computeHongKongReadingStreak,
  EncouragementPeerEntry,
} from './readingStreak'

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
