import { linkOAuthAccount } from '@/actions/auth'
import { getUserById } from '@/actions/user'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth from 'next-auth'

import authConfig from '@/config/auth'
import { db } from '@/lib/db/db'

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    debug: process.env.NODE_ENV === 'development',
    pages: {
        signIn: '/sign-in',
        signOut: '/sign-out',
        verifyRequest: '/sign-in/magic-link-signin',
    },
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 daysd
        updateAge: 24 * 60 * 60, // 24 hours
    },
    events: {
        async linkAccount({ user }) {
            if (user.id) await linkOAuthAccount({ userId: user.id })
        },
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) token.role = user.is_admin ? 'ADMIN' : 'USER'
            return token
        },
        session({ session, token }) {
            session.user.role = token.role as 'USER' | 'ADMIN'
            session.sessionToken = token.sub as string
            return session
        },
        async signIn({ user, account }) {
            if (!user.id) return false
            if (account?.provider !== 'credentials') return true

            const existingUser = await getUserById({ id: user.id })
            return !!existingUser
        },
    },
    adapter: DrizzleAdapter(db),
    ...authConfig,
})
