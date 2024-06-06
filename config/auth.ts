import { getUserByEmail } from '@/actions/user';
import bcryptjs from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import ResendProvider from 'next-auth/providers/resend';

import { MagicLinkEmail } from '@/components/email/magic-link-email';
import { resend } from '@/config/email';
import { siteConfig } from '@/config/site';
import { signInWithPasswordSchema } from '@/validations/auth';

export default {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      async authorize(rawCredentials) {
        const validatedCredentials =
          signInWithPasswordSchema.safeParse(rawCredentials);

        if (validatedCredentials.success) {
          const user = await getUserByEmail({
            email: validatedCredentials.data.email,
          });
          if (!user || !user.passwordHash) return null;

          const passwordIsValid = await bcryptjs.compare(
            validatedCredentials.data.password,
            user.passwordHash,
          );

          if (passwordIsValid) return user;
        }
        return null;
      },
    }),
    ResendProvider({
      server: {
        host: process.env.RESEND_HOST,
        port: Number(process.env.RESEND_PORT),
        auth: {
          user: process.env.RESEND_USERNAME,
          pass: process.env.RESEND_API_KEY,
        },
      },
      async sendVerificationRequest({
        identifier,
        url,
      }: {
        identifier: string;
        url: string;
      }) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_EMAIL_FROM,
            to: [identifier],
            subject: `${siteConfig.name} magic link sign in`,
            react: MagicLinkEmail({ identifier, url }),
          });

          console.log('Verification email sent');
        } catch (error) {
          throw new Error('Failed to send verification email');
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
