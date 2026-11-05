import { auth, signOut } from '@/auth'
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import Image from 'next/image'

const prisma = new PrismaClient()

export default async function ProfilePage() {
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

  const completedCount = user.progress.length
  const percentage = Math.round((completedCount / 30) * 100)

  return (
    <>
      <div className="card mt-3" style={{ textAlign: 'center' }}>
        {user.photoUrl && (
          <Image
            src={user.photoUrl}
            alt={user.name || ''}
            width={80}
            height={80}
            style={{ borderRadius: '50%', margin: '0 auto 16px' }}
          />
        )}
        <h2 className="text-2xl mb-1" style={{ fontWeight: 'bold' }}>
          {user.name}
        </h2>
        <p className="text-sm text-gray mb-3">
          {user.email}
        </p>
      </div>

      <div className="card">
        <h3 className="text-xl mb-3" style={{ fontWeight: 'bold', color: '#667eea' }}>
          讀經進度摘要
        </h3>
        
        <div className="grid grid-cols-2 mb-3">
          <div style={{ textAlign: 'center', padding: '16px', background: '#f3f4f6', borderRadius: '8px' }}>
            <div className="text-3xl" style={{ fontWeight: 'bold', color: '#667eea' }}>
              {completedCount}
            </div>
            <div className="text-sm text-gray mt-1">已完成天數</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: '#f3f4f6', borderRadius: '8px' }}>
            <div className="text-3xl" style={{ fontWeight: 'bold', color: '#10b981' }}>
              {percentage}%
            </div>
            <div className="text-sm text-gray mt-1">完成百分比</div>
          </div>
        </div>

        <div className="progress-bar mb-2">
          <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
        </div>
        <p className="text-sm text-gray text-center">
          還有 {30 - completedCount} 日
        </p>
      </div>

      <div className="card">
        <h3 className="text-xl mb-3" style={{ fontWeight: 'bold', color: '#667eea' }}>
          關於此讀經計劃
        </h3>
        <p className="text-sm mb-2" style={{ lineHeight: '1.6' }}>
          這是一個30日完成馬可福音（和合本）的讀經挑戰，共678節經文按故事段落切分。
        </p>
        <p className="text-sm mb-2" style={{ lineHeight: '1.6' }}>
          第21-30日特別跟隨主最後一週的腳蹤：上耶路撒冷、聖殿衝突、橄欖山講論、逾越節夜、受審釘十架，直到復活。
        </p>
        <p className="text-sm" style={{ lineHeight: '1.6', color: '#667eea', fontWeight: 600 }}>
          願主的話成為你腳前的燈、路上的光。
        </p>
      </div>

      <form
        action={async () => {
          'use server'
          await signOut({ redirectTo: '/login' })
        }}
      >
        <button type="submit" className="button button-danger" style={{ width: '100%' }}>
          登出帳戶
        </button>
      </form>

      <div style={{ height: '20px' }} />
    </>
  )
}
