import { EncouragementPeerBoard as EncouragementPeerBoardData } from '@/lib/readingStreak'

type EncouragementPeerBoardProps = EncouragementPeerBoardData

/**
 * 「同行榜」— mutual encouragement without exposing identity.
 *
 * @note Displays each person’s all-time highest consecutive-reading record
 * (最高連續紀錄), not the live current streak that resets after a missed day.
 * Community stats count Hong Kong calendar days from `progress.readAt`.
 */
export default function EncouragementPeerBoard({
  entries,
  readersTodayCount,
  restartedThisWeekCount,
}: EncouragementPeerBoardProps) {
  return (
    <div className="card mt-3">
      <h2 className="text-xl mb-1 text-primary" style={{ fontWeight: 'bold' }}>
        同行榜
      </h2>
      <p className="text-sm text-gray mb-1" style={{ lineHeight: 1.6 }}>
        彼此勉勵，激發愛主的心🔥——這裡不是競賽，而是一同進入敬拜🙌。
      </p>
      <p className="text-sm text-gray mb-3" style={{ lineHeight: 1.6 }}>
        按「最高連續紀錄」排列；已完成總日數同樣記念你，漏了一日也不會變成零。
      </p>

      <div
        style={{
          padding: '14px 16px',
          marginBottom: '16px',
          borderRadius: '12px',
          background: 'var(--color-primary-soft)',
          border: '1px solid var(--color-border)',
        }}
      >
        <p style={{ lineHeight: 1.7, fontWeight: 600 }}>
          今日已有{' '}
          <strong className="text-primary" style={{ fontSize: '20px' }}>
            {readersTodayCount}
          </strong>{' '}
          位同行者讀了
        </p>
        <p className="mt-1" style={{ lineHeight: 1.7, fontWeight: 600 }}>
          今個星期有{' '}
          <strong className="text-primary" style={{ fontSize: '20px' }}>
            {restartedThisWeekCount}
          </strong>{' '}
          位同行者重新開始或第一次讀
        </p>
        <p className="text-sm text-gray mt-1" style={{ lineHeight: 1.6 }}>
          漏咗一日之後，喺本週一至今日再讀；本週先開始讀的同行者都算。
        </p>
      </div>

      {entries.length === 0 ? (
        <div
          className="text-sm text-gray text-center"
          style={{
            padding: '20px 12px',
            background: 'var(--color-primary-soft)',
            borderRadius: '12px',
            lineHeight: 1.6,
          }}
        >
          還沒有同行者記錄進度。完成第一日讀經後，你會在這裡與眾人彼此勉勵。
        </div>
      ) : (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {entries.map((entry, index) => (
            <li
              key={`${entry.nickname}-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '12px',
                border: entry.isYou
                  ? '2px solid var(--color-primary)'
                  : '1px solid var(--color-border)',
                background: entry.isYou ? 'var(--color-primary-soft)' : 'var(--color-surface)',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, wordBreak: 'break-word' }}>
                  {entry.nickname}
                  {entry.isYou && (
                    <span
                      style={{
                        marginLeft: '8px',
                        fontSize: '12px',
                        verticalAlign: 'middle',
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: 'var(--color-primary)',
                        color: 'white',
                        fontWeight: 700,
                      }}
                    >
                      你
                    </span>
                  )}
                </div>
              </div>
              <div
                className="text-sm text-gray"
                style={{ textAlign: 'right', flexShrink: 0, lineHeight: 1.5 }}
              >
                <div style={{ fontSize: '15px' }}>
                  已完成總日數{' '}
                  <strong className="text-primary" style={{ fontSize: '18px' }}>
                    {entry.daysCompleted}
                  </strong>{' '}
                  日
                </div>
                <div>
                  最高連續紀錄 <strong className="text-primary">{entry.bestStreak}</strong> 日
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
