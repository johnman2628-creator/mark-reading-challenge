/**
 * After-reading toast lines shown when someone marks today complete.
 *
 * @note Traditional Chinese, church mutual encouragement. No 僕人 /
 * servant-of-the-Lord phrasing.
 */
export const AFTER_READING_ENCOURAGEMENTS = [
  '今日都來到主面前，好好。',
  '願主的話成為你今日的力量。',
  '每一步都是恩典，繼續前行。',
  '今日你都讀完，做得好！',
  '主必看顧你的擺上。',
  '一天一步，與主同行。',
  '主真的最欣賞你㗎！',
  '讀完有啲向主回應都好㗎～',
  '聖靈會透過神的話幫助你～',
  '多一次！多一次！信心上升～',
] as const

/** Always shown on the personal progress card (pastor copy). */
export const PERSONAL_PROGRESS_MOTTO_LINES = [
  '微步大成功！',
  '重點不是讀幾多，而是享受多～',
] as const

/**
 * Restart line on the personal progress card.
 *
 * @param hasReadToday - True if this person already has Hong Kong-today progress
 * @note A missed day is okay; starting again today is a new beginning;
 * completed days still count.
 */
export function personalProgressRestartCopy(hasReadToday: boolean): string {
  if (hasReadToday) {
    return '今日你已經讀過喇，呢個就係新嘅開始；已經完成嘅日子仍然記念你。'
  }
  return '斷咗唔緊要，今日再讀就係新嘅開始；已經完成嘅日子仍然記念你。'
}

/**
 * Full personal-card copy: mottos first, then the restart encouragement.
 *
 * @param hasReadToday - True if this person already has Hong Kong-today progress
 */
export function personalProgressEncouragementLines(hasReadToday: boolean): string[] {
  return [
    ...PERSONAL_PROGRESS_MOTTO_LINES,
    personalProgressRestartCopy(hasReadToday),
  ]
}
