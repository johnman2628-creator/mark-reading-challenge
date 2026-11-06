import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

/**
 * Edge-safe Auth.js config (middleware + shared provider options).
 *
 * Google is a confidential web client (we have a client secret). Auth.js v5
 * still defaults OAuth `checks` to PKCE. That makes the token request send
 * `code_verifier` even when Google issued the authorization code without a
 * `code_challenge` (typical for this client type, and worse with Safari/iOS
 * cookie partitions). Google then returns `invalid_grant`:
 * "code_verifier or verifier is not needed."
 *
 * `checks: ["state"]` keeps CSRF protection and tells Auth.js to omit PKCE
 * on both authorize and token exchange. `trustHost: true` is required behind
 * Vercel so callback/cookie URLs follow `AUTH_URL` / `X-Forwarded-Host`.
 */
export const authConfig = {
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
      checks: ['state'],
      authorization: {
        params: {
          // Account chooser without forcing re-consent (prompt=consent +
          // access_type=offline was extra hops and not needed for JWT sessions).
          prompt: 'select_account',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnLogin = nextUrl.pathname.startsWith('/login')
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      } else if (isLoggedIn && isOnLogin) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return true
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.googleSub = profile.sub
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.googleSub = token.googleSub as string
      }
      return session
    },
  },
} satisfies NextAuthConfig
