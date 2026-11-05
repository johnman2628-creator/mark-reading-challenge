import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import PlanList from '@/components/PlanList'
import ShareWhatsAppButton from '@/components/ShareWhatsAppButton'
import { buildChallengeWhatsAppMessage, buildWhatsAppShareUrl } from '@/lib/plan'

const prisma = new PrismaClient()

export default async function PlanPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      progress: true,
    },
  })

  if (!user) {
    redirect('/login')
  }

  const allDays = await prisma.planDay.findMany({
    orderBy: { day: 'asc' },
  })

  const completedDays = new Set(user.progress.map(p => p.day))
  const shareChallengeUrl = buildWhatsAppShareUrl(buildChallengeWhatsAppMessage())

  return (
    <>
      <div className="card mt-3">
        <h2 className="text-2xl mb-2 text-primary" style={{ fontWeight: 'bold' }}>
          30日讀經表
        </h2>
        <p className="text-sm text-gray">
          馬可福音（和合本）· 共678節
        </p>
        <ShareWhatsAppButton href={shareChallengeUrl} compact className="mt-3" />
      </div>

      <PlanList
        planDays={allDays}
        completedDays={completedDays}
        userId={user.id}
      />
    </>
  )
}
