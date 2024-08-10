import { linkOAuthAccount } from '@/actions/auth';
import { getUserById } from '@/actions/user';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';

import authConfig from '@/config/auth';
import { env } from '@/env.mjs';
import { db } from '@/lib/db/db';
import { UUID } from 'crypto';
import { siteConfig } from './config/site';

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
      if (user.id) await linkOAuthAccount({ userId: user.id });
    },
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.is_admin ? 'ADMIN' : 'USER';
        token.id = user.id as UUID;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as 'USER' | 'ADMIN';
      session.sessionToken = token.sub as string;
      session.user.id = token.id as UUID;
      return session;
    },
    async signIn({ user, account }) {
      if (!user.id) return false;
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUserById({ id: user.id });
      return !!existingUser;
    },
  },
  adapter: DrizzleAdapter(db),
  ...authConfig,
});
