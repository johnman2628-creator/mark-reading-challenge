import markCuvData from '@/lib/data/mark-cuv.json'

type MarkCuvBundle = {
  version: string
  versionLabel: string
  book: string
  bookLabel: string
  source: string
  chapters: Record<string, Record<string, string>>
}

const DATA = markCuvData as MarkCuvBundle

/** Soft cap for WhatsApp `text=` payloads (leave room for invite + URL). */
const WHATSAPP_VERSE_CHAR_BUDGET = 1200

export type PassageRange = {
  startChapter: number
  startVerse: number
  endChapter: number
  endVerse: number
}

/**
 * Parse a plan passage like `1:1–1:20` or `15:33–16:20` into chapter/verse bounds.
 */
export function parseMarkPassage(passage: string): PassageRange | null {
  const normalized = passage.replace(/[–—]/g, '-')
  const match = normalized.match(
    /^(\d+)\s*:\s*(\d+)\s*-\s*(\d+)\s*:\s*(\d+)$/
  )
  if (!match) return null
  return {
    startChapter: Number(match[1]),
    startVerse: Number(match[2]),
    endChapter: Number(match[3]),
    endVerse: Number(match[4]),
  }
}

/**
 * Collect CUV verse texts for an inclusive Mark passage range.
 */
export function getCuvVersesForPassage(passage: string): Array<{
  chapter: number
  verse: number
  text: string
}> {
  const range = parseMarkPassage(passage)
  if (!range) return []

  const out: Array<{ chapter: number; verse: number; text: string }> = []
  for (let ch = range.startChapter; ch <= range.endChapter; ch += 1) {
    const chapterVerses = DATA.chapters[String(ch)]
    if (!chapterVerses) continue
    const verseNums = Object.keys(chapterVerses)
      .map(Number)
      .sort((a, b) => a - b)
    for (const v of verseNums) {
      if (ch === range.startChapter && v < range.startVerse) continue
      if (ch === range.endChapter && v > range.endVerse) continue
      const text = chapterVerses[String(v)]
      if (text) out.push({ chapter: ch, verse: v, text })
    }
  }
  return out
}

/**
 * Classic Traditional 和合本 (Bible Gateway `CUV`) link for a Mark passage.
 * Kept here to avoid a circular import with `@/lib/plan`.
 */
function buildCuvUrl(passage: string): string {
  const normalized = passage.replace(/[–—]/g, '-')
  const query = encodeURIComponent(`Mark ${normalized}`).replace(/%20/g, '+')
  return `https://www.biblegateway.com/passage/?search=${query}&version=CUV`
}

/**
 * Format CUV verses for WhatsApp: numbered lines, truncated with … + CUV link if long.
 */
export function formatCuvPassageForShare(passage: string): {
  verseBlock: string
  truncated: boolean
  bibleUrl: string
} {
  const bibleUrl = buildCuvUrl(passage)
  const verses = getCuvVersesForPassage(passage)
  if (verses.length === 0) {
    return {
      verseBlock: `（請打開和合本閱讀：${bibleUrl}）`,
      truncated: true,
      bibleUrl,
    }
  }

  const lines: string[] = []
  let used = 0
  let truncated = false

  for (const item of verses) {
    const line = `${item.chapter}:${item.verse} ${item.text}`
    const nextLen = used + line.length + (lines.length ? 1 : 0)
    if (lines.length > 0 && nextLen > WHATSAPP_VERSE_CHAR_BUDGET) {
      truncated = true
      break
    }
    lines.push(line)
    used = nextLen
  }

  let verseBlock = lines.join('\n')
  if (truncated) {
    verseBlock += `\n…\n全文（和合本 CUV）：${bibleUrl}`
  }

  return { verseBlock, truncated, bibleUrl }
}

/** Bundled CUV metadata (for docs / debugging). */
export function getMarkCuvSourceNote(): string {
  return `${DATA.versionLabel} · ${DATA.source}`
}
