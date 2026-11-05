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
    async signIn({ user, account, profile }) {
      if (!user.email) return false
      
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      })

      if (!existingUser && profile?.sub) {
        await prisma.user.create({
          data: {
            email: user.email,
            googleSub: profile.sub,
            name: user.name,
            photoUrl: user.image,
          }
        })
      }

      return true
    },
  },
})
