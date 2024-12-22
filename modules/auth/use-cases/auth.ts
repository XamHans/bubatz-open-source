'use server'

import crypto from 'crypto'

import { signIn } from '@/auth'
import bcryptjs from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { AuthError } from 'next-auth'
import { unstable_noStore as noStore } from 'next/cache'

import { ResetPasswordEmail } from '@/components/emails/reset-password-email'
import { resend } from '@/config/email'
import { db } from '@/lib/db/db'
import { members } from '@/modules/members/data-access/schema'
import { ClubMemberStatus } from '@/modules/members/types'
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
} from '../data-access/auth'
import { psLinkOAuthAccount } from '../data-access/prepared/statements'
import {
  checkIfFirstUser,
  getUserByEmail,
  getUserByResetPasswordToken,
} from './user'

export async function signUpWithPassword(
  rawInput: SignUpWithPasswordFormInput,
): Promise<'success'> {
  try {
    const validatedInput = signUpWithPasswordSchema.safeParse(rawInput)
    if (!validatedInput.success) {
      throw new Error('Invalid input')
    }

    const user = await getUserByEmail({ email: validatedInput.data.email })
    if (user) {
      throw new Error('User already exists')
    }

    // check if first user ever, then make them an admin
    const firstMember = await checkIfFirstUser()
    const passwordHash = await bcryptjs.hash(validatedInput.data.password, 10)
    const emailVerificationToken = crypto.randomBytes(32).toString('base64url')
    console.log({ passwordHash, emailVerificationToken })

    const newUser = await db
      .insert(members)
      .values({
        email: validatedInput.data.email,
        passwordHash: passwordHash,
        emailVerificationToken: emailVerificationToken,
        role: firstMember ? 'ADMIN' : 'MEMBER',
        status: firstMember
          ? ClubMemberStatus.ACTIVE
          : ClubMemberStatus.REQUEST,
        birthday: '2000-01-01',
      })
      .returning()

    if (!newUser) {
      throw new Error('Failed to create user')
    }

    return 'success'
  } catch (error) {
    console.error(error)
    throw error instanceof Error ? error : new Error('Error signing up')
  }
}

export async function signInWithPassword(
  rawInput: SignInWithPasswordFormInput,
): Promise<'success' | 'invalid-credentials'> {
  try {
    const validatedInput = signInWithPasswordSchema.safeParse(rawInput)
    if (!validatedInput.success) {
      throw new Error('Invalid input')
    }
    const existingUser = await getUserByEmail({
      email: validatedInput.data.email,
    })
    if (!existingUser) {
      throw new Error('User not registered')
    }

    if (!existingUser.email || !existingUser.passwordHash) {
      throw new Error('Incorrect provider')
    }

    // if (!existingUser.emailVerified) throw new Error('Email not verified');

    const signInResult = await signIn('credentials', {
      email: validatedInput.data.email,
      password: validatedInput.data.password,
      redirect: false,
    })

    console.log({ signInResult })

    return 'success'
  } catch (error) {
    console.error(error)
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'invalid-credentials'
        default:
          throw error
      }
    } else {
      throw new Error('Error signin in with password')
    }
  }
}

export async function resetPassword(
  rawInput: PasswordResetFormInput,
): Promise<'success'> {
  try {
    const validatedInput = passwordResetSchema.safeParse(rawInput)
    if (!validatedInput.success) {
      throw new Error('Invalid input')
    }

    const member = await getUserByEmail({ email: validatedInput.data.email })
    if (!member) {
      throw new Error('User not found')
    }

    const today = new Date()
    const resetPasswordToken = crypto.randomBytes(32).toString('base64url')
    const resetPasswordTokenExpiry = new Date(
      today.setDate(today.getDate() + 1),
    ) // 24 hours from now

    const memberUpdated = await db
      .update(members)
      .set({
        resetPasswordToken,
        resetPasswordTokenExpiry,
      })
      .where(eq(members.id, member.id))
      .returning()

    if (!memberUpdated) {
      throw new Error('Failed to update member with reset token')
    }

    const emailSent = await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM,
      to: [validatedInput.data.email],
      subject: 'Reset your password',
      react: ResetPasswordEmail({
        email: validatedInput.data.email,
        resetPasswordToken,
      }),
    })

    if (!emailSent) {
      throw new Error('Failed to send reset password email')
    }

    return 'success'
  } catch (error) {
    console.error(error)
    throw error instanceof Error ? error : new Error('Error resetting password')
  }
}

export async function updatePassword(
  rawInput: PasswordUpdateFormInputExtended,
): Promise<'success'> {
  try {
    const validatedInput = passwordUpdateSchemaExtended.safeParse(rawInput)
    if (!validatedInput.success) {
      throw new Error('Invalid input')
    }

    const member = await getUserByResetPasswordToken({
      token: validatedInput.data.resetPasswordToken,
    })
    if (!member) {
      throw new Error('User not found')
    }
    //@ts-ignore
    const resetPasswordExpiry = member.resetPasswordTokenExpiry
    if (!resetPasswordExpiry || resetPasswordExpiry < new Date()) {
      throw new Error('Reset token has expired')
    }

    const passwordHash = await bcryptjs.hash(validatedInput.data.password, 10)

    const memberUpdated = await db
      .update(members)
      .set({
        passwordHash,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      })
      .where(eq(members.id, member.id))
      .returning()

    if (!memberUpdated) {
      throw new Error('Failed to update password')
    }

    return 'success'
  } catch (error) {
    console.error(error)
    throw error instanceof Error ? error : new Error('Error updating password')
  }
}

export async function linkOAuthAccount(
  rawInput: LinkOAuthAccountInput,
): Promise<void> {
  try {
    const validatedInput = linkOAuthAccountSchema.safeParse(rawInput)
    if (!validatedInput.success) return

    noStore()
    await psLinkOAuthAccount.execute({
      memberId: validatedInput.data.memberId,
    })
  } catch (error) {
    console.error(error)
    throw new Error('Error linking OAuth account')
  }
}
