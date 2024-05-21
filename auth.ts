import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const supabase = createClientComponentClient({
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          });

          const { email } = parsedCredentials.data;
          const user = await supabase
            .from("profiles")
            .select("*")
            .eq("email", email)
            .single();
          // const user = await getUser(email);
          // if (!user) return null;
          return user.data ? user.data : null;
        }

        return null;
      },
    }),
  ],
});
