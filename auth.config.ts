import type { NextAuthConfig } from "next-auth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const authConfig = {
  pages: {
    signIn: "/sign-in   ",
  },
  callbacks: {
    /**
    authorized({ auth, request: { nextUrl } }) {
        
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    */
    jwt({ token, user }) {
      if (user) {
        if (user.is_owner) token.role = "owner";
        else if (user.is_admin) token.role = "admin";
        else token.role = "user";
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
