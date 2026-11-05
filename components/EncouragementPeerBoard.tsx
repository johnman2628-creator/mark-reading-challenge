import { EncouragementPeerEntry } from '@/lib/readingStreak'

interface EncouragementPeerBoardProps {
  entries: EncouragementPeerEntry[]
}

/**
 * 「同行榜」— mutual encouragement without exposing identity.
 */
export default function EncouragementPeerBoard({ entries }: EncouragementPeerBoardProps) {
  return (
    <div className="card mt-3">
      <h2 className="text-xl mb-1 text-primary" style={{ fontWeight: 'bold' }}>
        同行榜
      </h2>
      <p className="text-sm text-gray mb-3" style={{ lineHeight: 1.6 }}>
        彼此勉勵，激發愛主的心🔥——這裡不是競賽，而是一同進入敬拜🙌。
      </p>

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
                <div>
                  已完成 <strong className="text-primary">{entry.daysCompleted}</strong> 日
                </div>
                <div>
                  連續 <strong>{entry.streak}</strong> 日
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
