import { signIn } from '@/auth'

export default function LoginPage() {
  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h1 className="text-3xl mb-3" style={{ color: '#667eea', fontWeight: 'bold' }}>
          馬可福音30日讀經挑戰
        </h1>
        <p className="text-gray mb-4" style={{ lineHeight: '1.6' }}>
          與弟兄姊妹一同，用30日完成馬可福音（和合本）
        </p>
        <p className="text-sm text-gray mb-4">
          每日按故事段落閱讀，配合查經信息，一步步經歷主的恩典
        </p>
        <form
          action={async () => {
            'use server'
            await signIn('google', { redirectTo: '/dashboard' })
          }}
        >
          <button type="submit" className="button button-primary" style={{ width: '100%' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
              <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
              <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
              <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.991 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
            </svg>
            用 Google 繼續
          </button>
        </form>
        <p className="text-sm text-gray mt-3">
          登入後將建立你的個人讀經進度
        </p>
      </div>
    </div>
  )
}
