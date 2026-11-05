import { randomInt } from 'crypto'
import { PrismaClient } from '@prisma/client'

const EMOJIS = ['🐑', '🕊️', '🦌', '🌻', '🐬', '🦉', '🌿', '☀️'] as const
const TRAITS = ['熱心', '溫柔', '喜樂', '感恩', '忠心', '平安', '剛強'] as const

/**
 * One-time anonymous display name (no PII).
 */
export function generateEncouragementNickname(): string {
  const emoji = EMOJIS[randomInt(EMOJIS.length)]
  const trait = TRAITS[randomInt(TRAITS.length)]
  const num = randomInt(10, 100)
  return `${emoji} ${trait}的同行者 #${num}`
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2002'
  )
}

/**
 * Assign and persist a nickname the first time a user appears on the peer board.
 */
export async function ensureEncouragementNickname(
  prisma: PrismaClient,
  userId: string
): Promise<string> {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { encouragementNickname: true },
  })

  if (existing?.encouragementNickname) {
    return existing.encouragementNickname
  }

  for (let attempt = 0; attempt < 12; attempt++) {
    const nickname = generateEncouragementNickname()
    try {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { encouragementNickname: nickname },
        select: { encouragementNickname: true },
      })
      return updated.encouragementNickname!
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        continue
      }
      throw error
    }
  }

  throw new Error('Unable to assign encouragement nickname')
}
