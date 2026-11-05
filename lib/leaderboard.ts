import { PrismaClient } from '@prisma/client'
import { ensureEncouragementNickname } from '@/lib/encouragementNickname'
import {
  computeHongKongReadingStreak,
  EncouragementPeerBoard,
  EncouragementPeerEntry,
} from '@/lib/readingStreak'

/**
 * Anonymous peer encouragement board — nicknames and counts only.
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

  for (const participant of participants) {
    const nickname =
      participant.encouragementNickname ??
      (await ensureEncouragementNickname(prisma, participant.id))

    entries.push({
      nickname,
      daysCompleted: participant.progress.length,
      streak: computeHongKongReadingStreak(
        participant.progress.map((row) => new Date(row.readAt))
      ),
      isYou: participant.id === currentUserId,
    })
  }

  entries.sort((a, b) => {
    if (b.daysCompleted !== a.daysCompleted) {
      return b.daysCompleted - a.daysCompleted
    }
    if (b.streak !== a.streak) {
      return b.streak - a.streak
    }
    return a.nickname.localeCompare(b.nickname, 'zh-HK')
  })

  return { entries }
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
