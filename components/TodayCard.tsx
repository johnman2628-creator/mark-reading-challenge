'use client'

import { useState } from 'react'
import { PlanDay } from '@prisma/client'
import ShareWhatsAppButton from '@/components/ShareWhatsAppButton'
import {
  buildBibleGatewayCuvmptUrl,
  buildTodayWhatsAppMessage,
  buildWhatsAppShareUrl,
} from '@/lib/plan'
import { buildSermonUrlForPlanDay } from '@/lib/youtubePlaylist'

interface TodayCardProps {
  planDay: PlanDay
  isCompleted: boolean
  userId: string
  dateLabel: string
}

const encouragements = [
  '今日都來到主面前，好好。',
  '願主的話成為你今日的力量。',
  '每一步都是恩典，繼續前行。',
  '忠心的僕人，做得好！',
  '主必看顧你的擺上。',
  '一天一步，與主同行。',
]

export default function TodayCard({
  planDay,
  isCompleted: initialCompleted,
  userId,
  dateLabel,
}: TodayCardProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted)
  const [isLoading, setIsLoading] = useState(false)
  const [showEncouragement, setShowEncouragement] = useState(false)

  const handleToggleComplete = async () => {
    setIsLoading(true)

    try {
      if (!isCompleted) {
        const response = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ day: planDay.day }),
        })

        if (response.ok) {
          setIsCompleted(true)
          setShowEncouragement(true)
          setTimeout(() => setShowEncouragement(false), 4000)
          setTimeout(() => window.location.reload(), 1000)
        }
      } else {
        const response = await fetch(`/api/progress?day=${planDay.day}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setIsCompleted(false)
          setTimeout(() => window.location.reload(), 500)
        }
      }
    } catch (error) {
      console.error('Error toggling progress:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
  const bibleUrl = buildBibleGatewayCuvmptUrl(planDay.passage)
  const sermonUrl = planDay.sermonUrl ?? buildSermonUrlForPlanDay(planDay.day)
  const whatsAppUrl = buildWhatsAppShareUrl(
    buildTodayWhatsAppMessage({
      dateLabel,
      passage: planDay.passage,
      theme: planDay.theme,
    })
  )

  return (
    <>
      <div className="card card-hero">
        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="badge badge-soft">
              第 {planDay.day} 日
            </div>
            <div className="text-sm" style={{ fontWeight: 600 }}>
              {dateLabel}
            </div>
          </div>
          <div className="text-sm">
            {planDay.verseCount} 節
          </div>
        </div>

        <h2 className="text-2xl mb-2" style={{ fontWeight: 'bold' }}>
          馬可福音 {planDay.passage}
        </h2>

        <p className="text-lg mb-3">
          {planDay.theme}
        </p>

        <div className="text-sm mb-4" style={{ opacity: 0.85 }}>
          {planDay.chapter}
        </div>

        <div className="flex gap-2 flex-wrap">
          <a
            href={bibleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-secondary"
            style={{ flex: 1, minWidth: '140px', background: 'white' }}
          >
            打開和合本
          </a>
          <a
            href={sermonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-secondary"
            style={{
              flex: 1,
              minWidth: '140px',
              background: 'rgba(255,255,255,0.55)',
              borderColor: 'rgba(15, 41, 66, 0.25)',
              color: 'var(--color-hero-text)',
            }}
          >
            查經信息
          </a>
        </div>

        <ShareWhatsAppButton href={whatsAppUrl} className="mt-2" />

        <button
          onClick={handleToggleComplete}
          disabled={isLoading}
          className={`button ${isCompleted ? 'button-secondary' : 'button-success'}`}
          style={{
            width: '100%',
            marginTop: '12px',
            ...(isCompleted
              ? {
                  background: 'rgba(255,255,255,0.55)',
                  borderColor: 'rgba(15, 41, 66, 0.25)',
                  color: 'var(--color-hero-text)',
                }
              : {}),
          }}
        >
          {isLoading ? '處理中...' : isCompleted ? '✓ 已完成（點擊取消）' : '標記為已完成'}
        </button>
      </div>

      {showEncouragement && (
        <div
          className="card"
          style={{
            background: 'var(--color-success-soft)',
            color: '#0f5132',
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-in',
            borderColor: 'rgba(46, 204, 135, 0.35)',
          }}
        >
          <div className="text-xl" style={{ fontWeight: 'bold' }}>
            ✨ {randomEncouragement}
          </div>
        </div>
      )}
    </>
  )
}
