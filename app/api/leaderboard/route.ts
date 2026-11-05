import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'
import { getEncouragementPeerBoardResponse } from '@/lib/leaderboard'

const prisma = new PrismaClient()

/** Anonymous encouragement board — nicknames and progress counts only. */
export async function GET() {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const board = await getEncouragementPeerBoardResponse(prisma, user.id)

  return NextResponse.json(board)
}
