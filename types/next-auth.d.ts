import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      googleSub: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    googleSub: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    googleSub?: string
  }
}
