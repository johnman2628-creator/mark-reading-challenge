import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { authConfig } from './auth.config'

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      return !!user.email
    },
  },
  events: {
    async linkAccount({ user, profile }) {
      const sub =
        profile && typeof profile === 'object' && 'sub' in profile
          ? String(profile.sub)
          : undefined
      const picture =
        profile && typeof profile === 'object' && 'picture' in profile
          ? String(profile.picture)
          : undefined

      if (!sub && !picture) return

      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(sub ? { googleSub: sub } : {}),
          ...(picture ? { photoUrl: picture, image: picture } : {}),
        },
      })
    },
  },
})
