import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  getHongKongTodayIso,
  getHongKongWeekMondayIso,
  isHongKongDateInCurrentWeek,
} from './plan'

test('Hong Kong week starts on Monday (星期六 → 本週一)', () => {
  assert.equal(getHongKongWeekMondayIso('2026-11-21'), '2026-11-16')
})

test('Hong Kong week Monday is itself when today is Monday', () => {
  assert.equal(getHongKongWeekMondayIso('2026-11-16'), '2026-11-16')
})

test('Hong Kong Sunday belongs to the week that started the previous Monday', () => {
  assert.equal(getHongKongWeekMondayIso('2026-11-15'), '2026-11-09')
})

test('Hong Kong week Monday can fall in the previous year', () => {
  assert.equal(getHongKongWeekMondayIso('2026-01-01'), '2025-12-29')
})

test('Hong Kong today flips at midnight Asia/Hong_Kong, not UTC', () => {
  assert.equal(
    getHongKongTodayIso(new Date('2026-11-20T15:59:00.000Z')),
    '2026-11-20'
  )
  assert.equal(
    getHongKongTodayIso(new Date('2026-11-20T16:00:00.000Z')),
    '2026-11-21'
  )
})

test('current Hong Kong week is Monday through today, excluding last Sunday and tomorrow', () => {
  const today = '2026-11-21'
  assert.equal(isHongKongDateInCurrentWeek('2026-11-16', today), true)
  assert.equal(isHongKongDateInCurrentWeek('2026-11-21', today), true)
  assert.equal(isHongKongDateInCurrentWeek('2026-11-15', today), false)
  assert.equal(isHongKongDateInCurrentWeek('2026-11-22', today), false)
})
