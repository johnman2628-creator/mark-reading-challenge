'use client'

import { useState } from 'react'
import { PlanDay } from '@prisma/client'

interface TodayCardProps {
  planDay: PlanDay
  isCompleted: boolean
  userId: string
}

const encouragements = [
  '今日都來到主面前，好好。',
  '願主的話成為你今日的力量。',
  '每一步都是恩典，繼續前行。',
  '忠心的僕人，做得好！',
  '主必看顧你的擺上。',
  '一天一步，與主同行。',
]

export default function TodayCard({ planDay, isCompleted: initialCompleted, userId }: TodayCardProps) {
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

  return (
    <>
      <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div className="flex justify-between items-center mb-3">
          <div className="badge" style={{ background: 'rgba(255,255,255,0.3)', color: 'white' }}>
            第 {planDay.day} 日
          </div>
          <div className="text-sm">
            {planDay.verseCount} 節
          </div>
        </div>

        <h2 className="text-2xl mb-2" style={{ fontWeight: 'bold' }}>
          馬可福音 {planDay.passage}
        </h2>

        <p className="text-lg mb-3" style={{ opacity: 0.95 }}>
          {planDay.theme}
        </p>

        <div className="text-sm mb-4" style={{ opacity: 0.9 }}>
          {planDay.chapter}
        </div>

        <div className="flex gap-2">
          <a
            href={`https://www.biblegateway.com/passage/?search=Mark+${planDay.passage.replace('–', '-')}&version=CUVS`}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-secondary"
            style={{ flex: 1, background: 'white', color: '#667eea' }}
          >
            閱讀經文
          </a>
          {planDay.sermonUrl && (
            <a
              href={planDay.sermonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary"
              style={{ flex: 1, background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white' }}
            >
              查經信息
            </a>
          )}
        </div>

        <button
          onClick={handleToggleComplete}
          disabled={isLoading}
          className={`button ${isCompleted ? 'button-secondary' : 'button-success'}`}
          style={{ 
            width: '100%', 
            marginTop: '16px',
            background: isCompleted ? 'rgba(255,255,255,0.2)' : '#10b981',
            color: 'white',
            border: isCompleted ? '2px solid white' : 'none'
          }}
        >
          {isLoading ? '處理中...' : isCompleted ? '✓ 已完成（點擊取消）' : '標記為已完成'}
        </button>
      </div>

      {showEncouragement && (
        <div 
          className="card" 
          style={{ 
            background: '#10b981', 
            color: 'white', 
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-in'
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
