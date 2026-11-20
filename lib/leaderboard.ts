import { PrismaClient } from '@prisma/client'
import { ensureEncouragementNickname } from '@/lib/encouragementNickname'
import { getHongKongTodayIso } from '@/lib/plan'
import {
  compareEncouragementPeerEntries,
  computeHongKongBestReadingStreak,
  didStartOrRestartHongKongReadingThisWeek,
  EncouragementPeerBoard,
  EncouragementPeerEntry,
  hasHongKongProgressOnDate,
} from '@/lib/readingStreak'

/**
 * Anonymous peer encouragement board — nicknames and counts only.
 *
 * @note Ranked by all-time best consecutive-reading streak (最高連續紀錄),
 * derived from actual `progress.readAt` calendar days, not the live current streak.
 * Community stats (today’s readers, this-week start/restarts) use the same timestamps.
 */
export async function getEncouragementPeerBoard(
  prisma: PrismaClient,
  currentUserId: string
): Promise<EncouragementPeerBoard> {
  await ensureEncouragementNickname(prisma, currentUserId)

  const participants = await prisma.user.findMany({
    where: {
      progress: { some: {} },
    },
    select: {
      id: true,
      encouragementNickname: true,
      progress: {
        select: { readAt: true },
      },
    },
  })

  const entries: EncouragementPeerEntry[] = []
  const todayIso = getHongKongTodayIso()
  let readersTodayCount = 0
  let restartedThisWeekCount = 0

  for (const participant of participants) {
    const nickname =
      participant.encouragementNickname ??
      (await ensureEncouragementNickname(prisma, participant.id))

    const readAts = participant.progress.map((row) => new Date(row.readAt))

    if (hasHongKongProgressOnDate(readAts, todayIso)) {
      readersTodayCount++
    }
    if (didStartOrRestartHongKongReadingThisWeek(readAts, todayIso)) {
      restartedThisWeekCount++
    }

    entries.push({
      nickname,
      daysCompleted: participant.progress.length,
      bestStreak: computeHongKongBestReadingStreak(readAts),
      isYou: participant.id === currentUserId,
    })
  }

  entries.sort(compareEncouragementPeerEntries)

  return { entries, readersTodayCount, restartedThisWeekCount }
}

/**
 * JSON-safe payload for `/api/leaderboard` (no user ids, emails, or names).
 */
export async function getEncouragementPeerBoardResponse(
  prisma: PrismaClient,
  currentUserId: string
): Promise<EncouragementPeerBoard> {
  return getEncouragementPeerBoard(prisma, currentUserId)
}
