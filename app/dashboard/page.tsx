import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import TodayCard from '@/components/TodayCard'
import ShareWhatsAppButton from '@/components/ShareWhatsAppButton'
import {
  addCalendarDaysIso,
  buildChallengeWhatsAppMessage,
  buildWhatsAppShareUrl,
  formatPlanDateChinese,
  getDateIsoForPlanDay,
  getHongKongDateIsoFromReadAt,
  getHongKongTodayIso,
  getPlanDayForHongKongToday,
} from '@/lib/plan'

const prisma = new PrismaClient()

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      progress: {
        include: {
          planDay: true,
        },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  const allDays = await prisma.planDay.findMany({
    orderBy: { day: 'asc' },
  })

  const completedDays = new Set(user.progress.map(p => p.day))
  const totalDays = 30
  const completedCount = completedDays.size
  const percentage = Math.round((completedCount / totalDays) * 100)

  const datesWithProgress = user.progress
    .map(p => getHongKongDateIsoFromReadAt(new Date(p.readAt)))
    .reduce((acc, date) => {
      acc.add(date)
      return acc
    }, new Set<string>())

  let streak = 0
  let checkDateIso = getHongKongTodayIso()

  while (datesWithProgress.has(checkDateIso)) {
    streak++
    checkDateIso = addCalendarDaysIso(checkDateIso, -1)
  }

  const currentDay = getPlanDayForHongKongToday()
  const todayPlan = allDays.find(d => d.day === currentDay)
  const isCompleted = todayPlan ? completedDays.has(todayPlan.day) : false
  const todayDateLabel = todayPlan
    ? formatPlanDateChinese(getDateIsoForPlanDay(todayPlan.day))
    : formatPlanDateChinese(getHongKongTodayIso())

  const shareChallengeUrl = buildWhatsAppShareUrl(buildChallengeWhatsAppMessage())

  return (
    <>
      <div className="card mt-3">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-sm text-gray">連續閱讀</div>
            <div className="text-2xl text-primary" style={{ fontWeight: 'bold' }}>
              {streak} 日
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="text-sm text-gray">整體進度</div>
            <div className="text-2xl text-success" style={{ fontWeight: 'bold' }}>
              {percentage}%
            </div>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
        </div>
        <div className="text-sm text-gray text-center mt-1">
          已完成 {completedCount} / {totalDays} 日
        </div>
        <ShareWhatsAppButton href={shareChallengeUrl} compact className="mt-2" />
      </div>

      {todayPlan && (
        <TodayCard
          planDay={todayPlan}
          isCompleted={isCompleted}
          userId={user.id}
          dateLabel={todayDateLabel}
        />
      )}

      {completedCount === 30 && (
        <div
          className="card card-hero"
          style={{ textAlign: 'center' }}
        >
          <h2 className="text-2xl mb-2" style={{ fontWeight: 'bold' }}>🎉 恭喜完成！</h2>
          <p className="text-lg">你已完成30日馬可福音讀經挑戰</p>
          <p className="mt-2">願主的話常存在你心中，成為你腳前的燈、路上的光。</p>
        </div>
      )}
    </>
  )
}
