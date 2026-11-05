import { formatCuvPassageForShare } from '@/lib/markCuv'

/** Hong Kong timezone for calendar-day boundaries. */
export const PLAN_TIMEZONE = 'Asia/Hong_Kong'

/** First calendar day of the 30-day plan (Day 1). Override via env in deploy. */
export const PLAN_START_DATE =
  process.env.NEXT_PUBLIC_PLAN_START_DATE ?? '2026-11-06'

/** Public app URL for share messages. */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://mark-reading-challenge.vercel.app'

const PLAN_DAY_COUNT = 30

/**
 * @param isoDate - `YYYY-MM-DD`
 * @returns Days since Unix epoch (UTC midnight), for calendar arithmetic.
 */
function calendarDayNumber(isoDate: string): number {
  const [y, m, d] = isoDate.split('-').map(Number)
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000)
}

/**
 * @param dayNumber - Days since Unix epoch (UTC midnight)
 * @returns ISO date `YYYY-MM-DD`
 */
function isoFromCalendarDayNumber(dayNumber: number): string {
  const dt = new Date(dayNumber * 86_400_000)
  const y = dt.getUTCFullYear()
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0')
  const d = String(dt.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Today's calendar date in Asia/Hong_Kong as `YYYY-MM-DD`.
 */
export function getHongKongTodayIso(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: PLAN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

/**
 * ISO calendar date for plan day N (1–30): PLAN_START_DATE + (N − 1) days.
 */
export function getDateIsoForPlanDay(day: number): string {
  const offset = Math.max(1, Math.min(PLAN_DAY_COUNT, day)) - 1
  return isoFromCalendarDayNumber(calendarDayNumber(PLAN_START_DATE) + offset)
}

/**
 * @param isoDate - `YYYY-MM-DD`
 * @param deltaDays - Days to add (negative to go back)
 */
export function addCalendarDaysIso(isoDate: string, deltaDays: number): string {
  return isoFromCalendarDayNumber(calendarDayNumber(isoDate) + deltaDays)
}

/**
 * Plan day number (1–30) for a Hong Kong calendar date.
 * Before the plan starts → 1; after day 30 → 30.
 */
export function getPlanDayForHongKongDate(isoDate: string): number {
  const diff =
    calendarDayNumber(isoDate) - calendarDayNumber(PLAN_START_DATE) + 1
  return Math.min(PLAN_DAY_COUNT, Math.max(1, diff))
}

/** Plan day number for today in Hong Kong. */
export function getPlanDayForHongKongToday(now = new Date()): number {
  return getPlanDayForHongKongDate(getHongKongTodayIso(now))
}

/**
 * Traditional Chinese date label for HK readers, e.g.「11月6日」.
 */
export function formatPlanDateChinese(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0))
  return new Intl.DateTimeFormat('zh-HK', {
    timeZone: PLAN_TIMEZONE,
    month: 'long',
    day: 'numeric',
  }).format(dt)
}

/**
 * Bible Gateway classic Traditional 和合本 URL (`version=CUV`).
 * Not CUVMPT / RCUV / RCU17TS / 和合本修訂版.
 */
export function buildBibleGatewayCuvUrl(passage: string): string {
  const normalized = passage.replace(/[–—]/g, '-')
  const query = encodeURIComponent(`Mark ${normalized}`).replace(/%20/g, '+')
  return `https://www.biblegateway.com/passage/?search=${query}&version=CUV`
}

/** @deprecated Use {@link buildBibleGatewayCuvUrl}; kept as alias during rename. */
export function buildBibleGatewayCuvmptUrl(passage: string): string {
  return buildBibleGatewayCuvUrl(passage)
}

/**
 * WhatsApp share URL targeting the regular (consumer) WhatsApp app.
 *
 * Uses `https://api.whatsapp.com/send?text=` (not Business-specific schemes).
 * On phones this opens personal WhatsApp when installed; `wa.me` is avoided as
 * the primary host because some devices with WhatsApp Business resolve it to Business.
 */
export function buildWhatsAppShareUrl(message: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
}

/**
 * Mobile deep-link for consumer WhatsApp (`whatsapp://send?text=`).
 * Pair with {@link buildWhatsAppShareUrl} as https fallback.
 */
export function buildWhatsAppDeepLink(message: string): string {
  return `whatsapp://send?text=${encodeURIComponent(message)}`
}

/** Warm invite when sharing today's reading, including CUV verse text. */
export function buildTodayWhatsAppMessage(options: {
  dateLabel: string
  passage: string
  theme?: string
}): string {
  const { dateLabel, passage } = options
  const { verseBlock } = formatCuvPassageForShare(passage)

  return [
    `今日（${dateLabel}）馬可福音 ${passage}（和合本）`,
    '',
    verseBlock,
    '',
    '一起來讀啦～今天這段好有力量，願主的話鼓勵你！🙏',
    '',
    APP_URL,
  ].join('\n')
}

/** General invite for the challenge (plan page / header). */
export function buildChallengeWhatsAppMessage(): string {
  return [
    '你好！邀請你一起參加「馬可福音 30 日讀經挑戰」🙏',
    '',
    '30 日讀畢馬可福音（和合本），每日按段落閱讀，適合弟兄姊妹一同同行。',
    '',
    APP_URL,
  ].join('\n')
}

/**
 * Hong Kong calendar date string for a stored progress timestamp.
 */
export function getHongKongDateIsoFromReadAt(readAt: Date): string {
  return getHongKongTodayIso(readAt)
}
