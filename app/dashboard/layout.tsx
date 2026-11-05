import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="card" style={{ marginBottom: 0, borderRadius: 0, position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="container" style={{ padding: '12px 20px' }}>
          <div className="flex justify-between items-center">
            <h1 className="text-xl" style={{ color: '#667eea', fontWeight: 'bold' }}>馬可福音30日</h1>
            <div className="flex items-center gap-2">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || ''}
                  width={32}
                  height={32}
                  style={{ borderRadius: '50%' }}
                />
              )}
              <form
                action={async () => {
                  'use server'
                  await signOut({ redirectTo: '/login' })
                }}
              >
                <button type="submit" className="button button-secondary" style={{ padding: '6px 16px', fontSize: '14px' }}>
                  登出
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="container">
        {children}
      </div>

      <nav className="card" style={{ marginTop: '20px', marginBottom: 0, borderRadius: 0, position: 'sticky', bottom: 0 }}>
        <div className="container" style={{ padding: '12px 20px' }}>
          <div className="flex justify-between" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <Link href="/dashboard" className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="text-sm">今日</span>
            </Link>
            <Link href="/dashboard/plan" className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-sm">讀經表</span>
            </Link>
            <Link href="/dashboard/profile" className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-sm">我的</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
