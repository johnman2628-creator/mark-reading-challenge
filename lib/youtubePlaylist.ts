/** Mark Gospel 查經信息 YouTube playlist (church series). */
export const MARK_SERMON_PLAYLIST_ID = 'PLsEwVzkhyD7dcUYEgIdK0dz1OcIQ0qhg4'

/** Playlist order (24 videos); day 1 example: `8dob_uaT96s`. */
export const MARK_SERMON_VIDEO_IDS = [
  '8dob_uaT96s',
  'oLX5xsgD4uo',
  'MZTjqvi0NYo',
  '2kBRDdEAzMw',
  '1xj3VjipTPA',
  'RcuChkCq1rk',
  'XXjfpXd8TY8',
  '9wNQW2-ZDas',
  'jpSVmVASzpE',
  'Hvcq4c-rHuU',
  '-OSLfkk0RqU',
  'XuZD0e3RVHo',
  'Pof2uK0jKng',
  'JjjnlJ5Q7lY',
  'XhfiYhDvNiE',
  'atJ_WLZlsqE',
  '_iksJidMNVo',
  '0O8USMRBRiY',
  'Q0MtdsyggQ4',
  'LwCgr_Qqqys',
  'G75E3gHZ63M',
  'D29qX45hh_0',
  'mB_IdSuEs1U',
  'KcdvnXDRUZ8',
] as const

/**
 * YouTube watch URL for a plan day's 查經信息.
 * Days 1–24 map to playlist items 1–24; days 25–30 reuse the final playlist video
 * (24 messages covering the 30-day reading split).
 */
export function buildSermonUrlForPlanDay(day: number): string {
  const clampedDay = Math.max(1, Math.min(30, Math.floor(day)))
  const index =
    clampedDay <= MARK_SERMON_VIDEO_IDS.length
      ? clampedDay - 1
      : MARK_SERMON_VIDEO_IDS.length - 1
  const videoId = MARK_SERMON_VIDEO_IDS[index]
  return `https://www.youtube.com/watch?v=${videoId}&list=${MARK_SERMON_PLAYLIST_ID}`
}
