import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '馬可福音30日讀經挑戰',
  description: '30日完成馬可福音（和合本）',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  )
}
