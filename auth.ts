import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth from 'next-auth'

import authConfig from '@/config/auth'
import { env } from '@/env.mjs'
import { db } from '@/lib/db/db'
import { UUID } from 'crypto'
import { siteConfig } from './config/site'
import {
  accounts,
  sessions,
  verificationTokens,
} from './modules/auth/data-access/schema'
import { linkOAuthAccount } from './modules/auth/use-cases/auth'
import { getUserById } from './modules/auth/use-cases/user'
import { members } from './modules/members/data-access/schema'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: siteConfig.links.signIn,
    signOut: siteConfig.links.signOut,
    verifyRequest: '/signin/magic-link-signin',
  },
  secret: env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 daysd
    updateAge: 24 * 60 * 60, // 24 hours
  },
  events: {
    async linkAccount({ user }) {
      if (user.id) await linkOAuthAccount({ memberId: user.id })
    },
  },
  callbacks: {
    jwt({ token, user }) {
      console.log('jwt callback user', user)
      if (user) {
        token.role = user.role
        token.id = user.id as UUID
      }
      return token
    },
    session({ session, token }) {
      session.user.role = token.role as 'MEMBER' | 'ADMIN'
      session.sessionToken = token.sub as string
      session.user.id = token.id as UUID
      return session
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      // console.log('authorized callback auth', auth)
      return !!auth
    },
    async signIn({ user, account }) {
      if (!user.id) return false
      if (account?.provider !== 'credentials') return true

      const existingUser = await getUserById({ id: user.id })

      // return !existingUser?.emailVerified ? false : true;
      return !!existingUser
    },
  },
  adapter: DrizzleAdapter(db, {
    // @ts-ignore
    usersTable: members,
    // @ts-ignore
    accountsTable: accounts,
    // @ts-ignore
    sessionsTable: sessions,
    // @ts-ignore
    verificationTokensTable: verificationTokens,
  }),
  ...authConfig,
})
