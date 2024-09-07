import { EmailVerificationEmail } from '@/components/emails/email-verification-email'
import { resend } from '@/config/email'
import { env } from '@/env.mjs'
import { db } from '@/lib/db/db'
import { members } from '@/modules/members/data-access/schema'
import {
  EmailVerificationFormInput,
  emailVerificationSchema,
  MarkEmailAsVerifiedInput,
  markEmailAsVerifiedSchema,
} from '@/validations/email'
import { eq } from 'drizzle-orm/sql/expressions/conditions'
import { getUserByEmail } from '../modules/auth/use-cases/user'

export async function markEmailAsVerified(
  rawInput: MarkEmailAsVerifiedInput,
): Promise<'invalid-input' | 'error' | 'success'> {
  try {
    const validatedInput = markEmailAsVerifiedSchema.safeParse(rawInput)
    if (!validatedInput.success) return 'invalid-input'

    const userUpdated = await db
      .update(members)
      .set({
        emailVerified: new Date(),
        emailVerificationToken: null,
      })
      .where(eq(members.emailVerificationToken, validatedInput.data.token))

    return userUpdated ? 'success' : 'error'
  } catch (error) {
    console.error(error)
    throw new Error('Error marking email as verified')
  }
}

function generateToken(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function resendEmailVerificationLink(
  rawInput: EmailVerificationFormInput,
): Promise<'invalid-input' | 'not-found' | 'error' | 'success'> {
  try {
    const validatedInput = emailVerificationSchema.safeParse(rawInput)
    if (!validatedInput.success) return 'invalid-input'

    const user = await getUserByEmail({ email: validatedInput.data.email })
    if (!user) return 'not-found'

    const emailVerificationToken = generateToken()

    const userUpdated = await db
      .update(members)
      .set({
        emailVerificationToken,
      })
      .where(eq(members.email, validatedInput.data.email))

    const emailSent = await resend.emails.send({
      from: env.RESEND_EMAIL_FROM,
      to: [validatedInput.data.email],
      subject: 'Verify your email address',
      react: EmailVerificationEmail({
        email: validatedInput.data.email,
        emailVerificationToken,
      }),
    })

    return userUpdated && emailSent ? 'success' : 'error'
  } catch (error) {
    console.error(error)
    throw new Error('Error resending email verification link')
  }
}
