'use server';

import crypto from 'crypto';

import { signIn } from '@/auth';
import bcryptjs from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';
import { unstable_noStore as noStore } from 'next/cache';

import { ResetPasswordEmail } from '@/components/emails/reset-password-email';
import { resend } from '@/config/email';
import { db } from '@/lib/db/db';
import { psLinkOAuthAccount } from '@/lib/db/prepared/statements';
import { members } from '@/modules/members/data-access/schema';
import { ClubMemberStatus } from '@/modules/members/types';
import {
  linkOAuthAccountSchema,
  passwordResetSchema,
  passwordUpdateSchemaExtended,
  signInWithPasswordSchema,
  signUpWithPasswordSchema,
  type LinkOAuthAccountInput,
  type PasswordResetFormInput,
  type PasswordUpdateFormInputExtended,
  type SignInWithPasswordFormInput,
  type SignUpWithPasswordFormInput,
} from '../data-access/auth';
import { getUserByEmail, getUserByResetPasswordToken } from './user';

export async function signUpWithPassword(
  rawInput: SignUpWithPasswordFormInput,
): Promise<'invalid-input' | 'exists' | 'error' | 'success'> {
  try {
    const validatedInput = signUpWithPasswordSchema.safeParse(rawInput);

    if (!validatedInput.success) return 'invalid-input';

    const user = await getUserByEmail({ email: validatedInput.data.email });
    if (user) return 'exists';

    const passwordHash = await bcryptjs.hash(validatedInput.data.password, 10);
    const emailVerificationToken = crypto.randomBytes(32).toString('base64url');
    console.log({ passwordHash, emailVerificationToken });

    const newUser = await db
      .insert(members)
      .values({
        email: validatedInput.data.email,
        passwordHash: passwordHash,
        emailVerificationToken: emailVerificationToken,
        role: 'MEMBER',
        status: ClubMemberStatus.REQUEST,
      })
      .returning();
    // console.log({ newUser })
    // const emailSent = await resend.emails.send({
    //   from: process.env.RESEND_EMAIL_FROM as string,
    //   to: [validatedInput.data.email],
    //   subject: 'Verify your email address',
    //   react: EmailVerificationEmail({
    //     email: validatedInput.data.email,
    //     emailVerificationToken,
    //   }),
    // });

    // const result = newUser && !emailSent.error ? 'success' : 'error';
    return 'success';
  } catch (error) {
    console.error(error);
    return 'error';
  }
}

export async function signInWithPassword(
  rawInput: SignInWithPasswordFormInput,
): Promise<
  | 'invalid-input'
  | 'invalid-credentials'
  | 'not-registered'
  | 'unverified-email'
  | 'incorrect-provider'
  | 'success'
> {
  try {
    const validatedInput = signInWithPasswordSchema.safeParse(rawInput);
    if (!validatedInput.success) return 'invalid-input';
    const existingUser = await getUserByEmail({
      email: validatedInput.data.email,
    });
    if (!existingUser) return 'not-registered';

    if (!existingUser.email || !existingUser.passwordHash)
      return 'incorrect-provider';

    // if (!existingUser.emailVerified) return 'unverified-email';

    const signInResult = await signIn('credentials', {
      email: validatedInput.data.email,
      password: validatedInput.data.password,
      redirect: false,
    });

    console.log({ signInResult });

    return 'success';
  } catch (error) {
    console.error(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'invalid-credentials';
        default:
          throw error;
      }
    } else {
      throw new Error('Error signin in with password');
    }
  }
}

export async function resetPassword(
  rawInput: PasswordResetFormInput,
): Promise<'invalid-input' | 'not-found' | 'error' | 'success'> {
  try {
    const validatedInput = passwordResetSchema.safeParse(rawInput);
    if (!validatedInput.success) return 'invalid-input';

    const member = await getUserByEmail({ email: validatedInput.data.email });
    if (!member) return 'not-found';

    const today = new Date();
    const resetPasswordToken = crypto.randomBytes(32).toString('base64url');
    const resetPasswordTokenExpiry = new Date(
      today.setDate(today.getDate() + 1),
    ); // 24 hours from now

    /**
     * TODO: Switch to using a use case
     */
    const memberUpdated = await db
      .update(members)
      .set({
        resetPasswordToken,
        resetPasswordTokenExpiry,
      })
      .where(eq(members.id, member.id))
      .returning();

    const emailSent = await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM,
      to: [validatedInput.data.email],
      subject: 'Reset your password',
      react: ResetPasswordEmail({
        email: validatedInput.data.email,
        resetPasswordToken,
      }),
    });

    return memberUpdated && emailSent ? 'success' : 'error';
  } catch (error) {
    console.error(error);
    return 'error';
  }
}

export async function updatePassword(
  rawInput: PasswordUpdateFormInputExtended,
): Promise<'invalid-input' | 'not-found' | 'expired' | 'error' | 'success'> {
  try {
    const validatedInput = passwordUpdateSchemaExtended.safeParse(rawInput);
    if (!validatedInput.success) return 'invalid-input';

    const member = await getUserByResetPasswordToken({
      token: validatedInput.data.resetPasswordToken,
    });
    if (!member) return 'not-found';

    const resetPasswordExpiry = member.resetPasswordTokenExpiry;
    if (!resetPasswordExpiry || resetPasswordExpiry < new Date())
      return 'expired';

    const passwordHash = await bcryptjs.hash(validatedInput.data.password, 10);

    const memberUpdated = await db
      .update(members)
      .set({
        passwordHash,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      })
      .where(eq(members.id, member.id))
      .returning();

    return memberUpdated ? 'success' : 'error';
  } catch (error) {
    console.error(error);
    throw new Error('Error updating password');
  }
}

export async function linkOAuthAccount(
  rawInput: LinkOAuthAccountInput,
): Promise<void> {
  try {
    const validatedInput = linkOAuthAccountSchema.safeParse(rawInput);
    if (!validatedInput.success) return;

    noStore();
    await psLinkOAuthAccount.execute({
      memberId: validatedInput.data.memberId,
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error linking OAuth account');
  }
}
