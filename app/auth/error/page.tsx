import Link from 'next/link'

type AuthErrorCode =
  | 'Configuration'
  | 'AccessDenied'
  | 'Verification'
  | 'OAuthCallback'
  | 'OAuthAccountNotLinked'
  | 'Callback'
  | 'Default'

const ERROR_COPY: Record<AuthErrorCode, { title: string; body: string }> = {
  Configuration: {
    title: '登入未能完成',
    body: '伺服器設定或 Google 授權暫時出現問題。請返回登入頁再試一次。若仍然失敗，請清除此網站的資料（Safari：設定 → Safari → 進階 → 網站資料）或改用無痕視窗後重試。',
  },
  AccessDenied: {
    title: '已取消登入',
    body: '你已取消 Google 授權，或此帳戶未能登入。請返回登入頁，再選擇要使用的 Google 帳戶。',
  },
  Verification: {
    title: '驗證已失效',
    body: '驗證連結無效或已過期。請返回登入頁重新開始。',
  },
  OAuthCallback: {
    title: 'Google 登入中斷',
    body: '從 Google 返回時出現問題。請返回登入頁再試一次；若用 iPhone／Safari，可先清除此網站資料後重試。',
  },
  Callback: {
    title: 'Google 登入中斷',
    body: '從 Google 返回時出現問題。請返回登入頁再試一次；若用 iPhone／Safari，可先清除此網站資料後重試。',
  },
  OAuthAccountNotLinked: {
    title: '帳戶未能連結',
    body: '此電郵可能已用其他方式登入。請改用原先的 Google 帳戶，或聯絡小組負責人。',
  },
  Default: {
    title: '登入出現問題',
    body: '請返回登入頁再試一次。若仍然失敗，請清除此網站的資料後重試。',
  },
}

/**
 * Maps an Auth.js `error` query value to Traditional Chinese copy.
 * @param error Raw `searchParams.error` from Auth.js.
 */
function getErrorCopy(error?: string) {
  if (error && error in ERROR_COPY) {
    return ERROR_COPY[error as AuthErrorCode]
  }
  return ERROR_COPY.Default
}

/**
 * Friendly Auth.js error page (replaces the generic "Server error" screen).
 * @param props.searchParams Auth.js error query (`Configuration`, `AccessDenied`, …).
 */
export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const { title, body } = getErrorCopy(params.error)

  return (
    <div
      className="container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h1 className="text-2xl mb-3 text-primary" style={{ fontWeight: 'bold' }}>
          {title}
        </h1>
        <p className="text-gray mb-4" style={{ lineHeight: 1.6 }}>
          {body}
        </p>
        <Link href="/login" className="button button-primary" style={{ width: '100%' }}>
          返回登入
        </Link>
      </div>
    </div>
  )
}
