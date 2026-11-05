'use client'

import { useState } from 'react'
import { PlanDay } from '@prisma/client'

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
    <div className="card">
      {planDays.map((planDay) => {
        const isCompleted = completedDays.has(planDay.day)
        const isLoading = loadingDay === planDay.day

        return (
          <div
            key={planDay.day}
            style={{
              padding: '16px',
              borderBottom: planDay.day < 30 ? '1px solid #e5e7eb' : 'none',
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
                border: '2px solid #667eea',
                background: isCompleted ? '#667eea' : 'white',
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
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm" style={{ color: '#667eea', fontWeight: 'bold' }}>
                  第 {planDay.day} 日
                </span>
                <span className="text-sm text-gray">
                  {planDay.passage}
                </span>
                <span className="text-sm text-gray">
                  · {planDay.verseCount} 節
                </span>
              </div>
              <div className="text-sm" style={{ color: isCompleted ? '#10b981' : '#374151', fontWeight: 500 }}>
                {planDay.theme}
              </div>
              <div className="text-sm text-gray">
                {planDay.chapter}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
