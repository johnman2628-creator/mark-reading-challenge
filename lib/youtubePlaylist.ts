/** Mark Gospel 查經信息 YouTube playlist (church series). */
export const MARK_SERMON_PLAYLIST_ID = 'PLsEwVzkhyD7dcUYEgIdK0dz1OcIQ0qhg4'

/**
 * Playlist videos in YouTube list order (24 items).
 * Titles run from 第十五章（B）至第十六章 down to 綜覽 (reverse chapter order).
 */
export const MARK_SERMON_PLAYLIST_ITEMS = [
  { videoId: '8dob_uaT96s', title: '馬可福音第十五章（B）至第十六章', key: '15B-16' },
  { videoId: 'oLX5xsgD4uo', title: '馬可福音第十五章（A）', key: '15A' },
  { videoId: 'MZTjqvi0NYo', title: '馬可福音第十四章（E）', key: '14E' },
  { videoId: '2kBRDdEAzMw', title: '馬可福音第十四章（D）', key: '14D' },
  { videoId: '1xj3VjipTPA', title: '馬可福音第十四章（C）', key: '14C' },
  { videoId: 'RcuChkCq1rk', title: '馬可福音第十四章（B）', key: '14B' },
  { videoId: 'XXjfpXd8TY8', title: '馬可福音第十四章（A）', key: '14A' },
  { videoId: '9wNQW2-ZDas', title: '馬可福音第十三章（C）', key: '13C' },
  { videoId: 'jpSVmVASzpE', title: '馬可福音第十三章（B）', key: '13B' },
  { videoId: 'Hvcq4c-rHuU', title: '馬可福音第十三章（A）', key: '13A' },
  { videoId: '-OSLfkk0RqU', title: '馬可福音第十二章', key: '12' },
  { videoId: 'XuZD0e3RVHo', title: '馬可福音第十一章', key: '11' },
  { videoId: 'Pof2uK0jKng', title: '馬可福音第十章', key: '10' },
  { videoId: 'JjjnlJ5Q7lY', title: '馬可福音第九章', key: '9' },
  { videoId: 'XhfiYhDvNiE', title: '馬可福音第八章', key: '8' },
  { videoId: 'atJ_WLZlsqE', title: '馬可福音第七章', key: '7' },
  { videoId: '_iksJidMNVo', title: '馬可福音第六章', key: '6' },
  { videoId: '0O8USMRBRiY', title: '馬可福音第五章', key: '5' },
  { videoId: 'Q0MtdsyggQ4', title: '馬可福音第四章（B）', key: '4B' },
  { videoId: 'LwCgr_Qqqys', title: '馬可福音第四章（A）', key: '4A' },
  { videoId: 'G75E3gHZ63M', title: '馬可福音第三章', key: '3' },
  { videoId: 'D29qX45hh_0', title: '馬可福音第二章', key: '2' },
  { videoId: 'mB_IdSuEs1U', title: '馬可福音第一章', key: '1' },
  { videoId: 'KcdvnXDRUZ8', title: '馬可福音綜覽', key: 'overview' },
] as const

/** @deprecated Prefer MARK_SERMON_PLAYLIST_ITEMS; kept for callers that only need IDs. */
export const MARK_SERMON_VIDEO_IDS = MARK_SERMON_PLAYLIST_ITEMS.map((item) => item.videoId)

const SERMON_BY_KEY: Record<string, string> = Object.fromEntries(
  MARK_SERMON_PLAYLIST_ITEMS.map((item) => [item.key, item.videoId])
)

/**
 * Plan day → sermon key, mapped by Mark chapter(s) in that day’s passage.
 *
 * Rules:
 * - Prefer the chapter that the day’s reading focuses on (see seed `chapter` / majority).
 * - When a chapter has A/B(/C…) playlist parts and multiple plan days cover it,
 *   assign distinct parts in reading order; otherwise reuse the single video.
 * - Cross-chapter days (e.g. 1:40–2:12) use the chapter the plan labels (第二章).
 * - Ch 14 has five playlist parts (A–E) but only two primary plan days → 14A + 14C
 *   (day 28 starts at the arrest, matching part C). 14B/D/E unused.
 * - Ch 13 has A/B/C; days 25–26 → 13A + 13B (13C unused).
 * - 綜覽 is not assigned to a plan day.
 */
export const PLAN_DAY_SERMON_KEYS: Record<number, string> = {
  1: '1',
  2: '1', // reuse single ch.1 message
  3: '2',
  4: '2',
  5: '3',
  6: '3',
  7: '4A',
  8: '4B',
  9: '5',
  10: '5',
  11: '6',
  12: '6',
  13: '6',
  14: '7',
  15: '7',
  16: '8',
  17: '8',
  18: '9',
  19: '9',
  20: '10',
  21: '10',
  22: '11',
  23: '12',
  24: '12',
  25: '13A',
  26: '13B', // passage 13:24–14:11; primary label 第十三章（B）
  27: '14A', // 14:12–14:42 supper + Gethsemane
  28: '14C', // 14:43–14:72 arrest / trial / denial
  29: '15A',
  30: '15B-16',
}

/**
 * YouTube watch URL for a plan day’s 查經信息 (chapter-accurate playlist map).
 */
export function buildSermonUrlForPlanDay(day: number): string {
  const clampedDay = Math.max(1, Math.min(30, Math.floor(day)))
  const key = PLAN_DAY_SERMON_KEYS[clampedDay] ?? '1'
  const videoId = SERMON_BY_KEY[key] ?? SERMON_BY_KEY['1']
  return `https://www.youtube.com/watch?v=${videoId}&list=${MARK_SERMON_PLAYLIST_ID}`
}

/**
 * @returns Sermon playlist key for a plan day (for docs / debugging).
 */
export function getSermonKeyForPlanDay(day: number): string {
  const clampedDay = Math.max(1, Math.min(30, Math.floor(day)))
  return PLAN_DAY_SERMON_KEYS[clampedDay] ?? '1'
}
