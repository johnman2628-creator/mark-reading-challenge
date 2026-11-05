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

/**
 * Short spiritual one-liners keyed by plan `theme`.
 * Used in WhatsApp celebrate-share copy (not full verse dumps).
 */
const THEME_SHARE_ONE_LINERS: Record<string, string> = {
  '序言與呼召': '我更珍貴主從天而來💙',
  '迦百農的權柄與醫治': '主有權柄，今日也醫治我心🔥',
  '潔淨長大痲瘋的；抬褥子的人': '主能潔淨，也抬起我🙌',
  '召利未；禁食辯論': '主召我來跟隨，我願回應✨',
  '安息日醫治；選十二使徒': '主揀選我們，與祂同行🤝',
  '家屬；褻瀆聖靈': '行神旨意的，就是主的家人💙',
  '撒種的比喻': '願我心作好土，領受主道🌱',
  '燈與度量；平靜風浪': '風浪中有主，心就平安🌊',
  '格拉森趕鬼': '主大能釋放，黑暗退去🔥',
  '睚魯的女兒與血漏的婦人': '信心一摸，主就醫治🙌',
  '故鄉與差遣門徒': '奉主差遣，勇敢去傳✨',
  '施洗約翰之死；五餅二魚': '主能以少變多，供應有餘🍞',
  '水面行走；革尼撒勒醫治': '風浪裡仍緊握主的手💙',
  '古人的遺傳': '求主潔淨我內心，不單外貌🙏',
  '外邦婦人；聾啞人得醫治': '主的恩典臨到萬民🙌',
  '四千人；求神蹟與酵': '開我心眼，認得真糧✨',
  '伯賽大瞎子；彼得認信與捨己': '你是基督！我願捨己跟隨🔥',
  '登山變像；下山趕鬼': '榮耀山上，下山仍有能力⛰️',
  '第二預告；誰為大；不敵擋': '服事人的才是真正為大💙',
  '休妻；祝福小孩；財主': '像小孩般倚靠主🙌',
  '上耶路撒冷：第三次預告受難；雅各約翰求首位；瞎子巴底買得看見':
    '背起十架，跟隨主上耶路撒冷🔥',
  '受難週開始：騎驢進京（棕枝主日）；潔淨聖殿；無花果樹的教訓':
    '主進京城，我心向祂歡呼✨',
  '聖殿衝突：質疑耶穌權柄；惡園戶比喻；納稅給凱撒':
    '把該歸主的歸給主💙',
  '聖殿教導：復活辯論；最大的誡命；窮寡婦的兩個小錢':
    '盡心愛主，並愛鄰舍如己❤️',
  '橄欖山講論（上）：聖殿被毀預告；末世災難與假基督':
    '儆醒等候，不被迷惑👀',
  '橄欖山講論（下）與陰謀：人子降臨；儆醒；祭司設計；伯大尼膏抹':
    '為主擺上，馨香如膏抹🙏',
  '逾越節夜：預備筵席；設立聖餐；預告彼得不認；客西馬尼禱告':
    '主為我捨身，我記念祂的愛💙',
  '夜間受審：猶大親嘴出賣；被捕；公會審問；彼得三次不認主':
    '縱然軟弱，主仍不離棄🙌',
  '受難日（上）：解交彼拉多；鞭打受辱；帶到各各他；釘十字架':
    '主為我受苦，大愛測不透✨',
  '受難日與復活：耶穌斷氣；埋葬；七日的第一日從死裡復活':
    '主已復活！我心歡喜讚美🥳🔥',
}

/**
 * Warm personal one-liner for WhatsApp share, tied to plan theme when known.
 */
export function buildShareThemeOneLiner(theme?: string): string {
  if (theme && THEME_SHARE_ONE_LINERS[theme]) {
    return THEME_SHARE_ONE_LINERS[theme]
  }
  if (theme) {
    return `今日主題：「${theme}」✨`
  }
  return '願主的話繼續燃亮我心✨'
}

/**
 * Celebrate-today WhatsApp share: lively Cantonese-friendly Traditional Chinese.
 * Celebrates that the sharer already read today’s passage — no full CUV verse dump.
 *
 * Template example:
 * 「好嘢！🥳我今日讀咗馬可福音 1:1–1:20啦～我更珍貴主從天而來💙」
 */
export function buildTodayWhatsAppMessage(options: {
  dateLabel: string
  passage: string
  theme?: string
}): string {
  const { passage, theme } = options
  const oneLiner = buildShareThemeOneLiner(theme)

  return [
    `好嘢！🥳我今日讀咗馬可福音 ${passage}啦～${oneLiner}`,
    '',
    '一齊嚟讀馬可福音啦～🙌',
    APP_URL,
  ].join('\n')
}

/**
 * Home / progress-card invite WhatsApp share (dashboard progress + plan page).
 * Separate from {@link buildTodayWhatsAppMessage} (TodayCard celebrate share).
 */
export function buildChallengeWhatsAppMessage(): string {
  return [
    '我今日讀咗馬可福音啦☺️邀請你都一齊參加「馬可福音 30 日讀經挑戰」啦🫵',
    '',
    '30 日享讀完馬可福音，每日按段落閱讀，配合信息，仰望主的榮美✨️每日被祂自己和祂的愛吸引～',
    '',
    'https://mark-reading-challenge.vercel.app',
  ].join('\n')
}

/**
 * Hong Kong calendar date string for a stored progress timestamp.
 */
export function getHongKongDateIsoFromReadAt(readAt: Date): string {
  return getHongKongTodayIso(readAt)
}
