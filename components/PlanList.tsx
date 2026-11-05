'use client'

import { useState } from 'react'
import { PlanDay } from '@prisma/client'
import { formatPlanDateChinese, getDateIsoForPlanDay, buildBibleGatewayCuvmptUrl } from '@/lib/plan'
import { buildSermonUrlForPlanDay } from '@/lib/youtubePlaylist'

interface PlanListProps {
  planDays: PlanDay[]
  completedDays: Set<number>
  userId: string
}

export default function PlanList({ planDays, completedDays: initialCompletedDays, userId }: PlanListProps) {
  const [completedDays, setCompletedDays] = useState(initialCompletedDays)
  const [loadingDay, setLoadingDay] = useState<number | null>(null)

  const handleToggleDay = async (day: number) => {
    setLoadingDay(day)
    const isCompleted = completedDays.has(day)

    try {
      if (!isCompleted) {
        const response = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ day }),
        })

        if (response.ok) {
          setCompletedDays(new Set([...completedDays, day]))
        }
      } else {
        const response = await fetch(`/api/progress?day=${day}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          const newCompleted = new Set(completedDays)
          newCompleted.delete(day)
          setCompletedDays(newCompleted)
        }
      }
    } catch (error) {
      console.error('Error toggling day:', error)
    } finally {
      setLoadingDay(null)
    }
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {planDays.map((planDay) => {
        const isCompleted = completedDays.has(planDay.day)
        const isLoading = loadingDay === planDay.day
        const dateLabel = formatPlanDateChinese(getDateIsoForPlanDay(planDay.day))
        const bibleUrl = buildBibleGatewayCuvmptUrl(planDay.passage)
        const sermonUrl = planDay.sermonUrl ?? buildSermonUrlForPlanDay(planDay.day)

        return (
          <div
            key={planDay.day}
            style={{
              padding: '16px',
              borderBottom: planDay.day < 30 ? '1px solid var(--color-border)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <button
              onClick={() => handleToggleDay(planDay.day)}
              disabled={isLoading}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '2px solid var(--color-primary)',
                background: isCompleted ? 'var(--color-primary)' : 'white',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              {isCompleted && !isLoading && '✓'}
              {isLoading && '...'}
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm text-primary" style={{ fontWeight: 'bold' }}>
                  第 {planDay.day} 日
                </span>
                <span className="text-sm text-gray">{dateLabel}</span>
                <span className="text-sm text-gray">
                  {planDay.passage}
                </span>
                <span className="text-sm text-gray">
                  · {planDay.verseCount} 節
                </span>
              </div>
              <div
                className="text-sm"
                style={{
                  color: isCompleted ? 'var(--color-success)' : 'var(--color-text)',
                  fontWeight: 500,
                }}
              >
                {planDay.theme}
              </div>
              <div className="text-sm text-gray mb-2">
                {planDay.chapter}
              </div>
              <div className="flex gap-2 flex-wrap">
                <a
                  href={bibleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-secondary button-compact"
                  style={{ padding: '6px 12px' }}
                >
                  打開和合本
                </a>
                <a
                  href={sermonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-secondary button-compact"
                  style={{ padding: '6px 12px' }}
                >
                  查經信息
                </a>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
