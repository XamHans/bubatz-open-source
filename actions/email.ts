import { db } from '@/lib/db/db';
import { users } from '@/lib/db/schema';
import {
    EmailVerificationFormInput,
    emailVerificationSchema,
    MarkEmailAsVerifiedInput,
    markEmailAsVerifiedSchema,
} from '@/validations/email';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { getUserByEmail } from './user';

export async function markEmailAsVerified(
    rawInput: MarkEmailAsVerifiedInput,
): Promise<'invalid-input' | 'error' | 'success'> {
    try {
        const validatedInput = markEmailAsVerifiedSchema.safeParse(rawInput);
        if (!validatedInput.success) return 'invalid-input';

        const userUpdated = await db
            .update(users)
            .set({
                emailVerified: new Date(),
                emailVerificationToken: null,
            })
            .where(eq(users.emailVerificationToken, validatedInput.data.token));

        return userUpdated ? 'success' : 'error';
    } catch (error) {
        console.error(error);
        throw new Error('Error marking email as verified');
    }
}

export async function resendEmailVerificationLink(
    rawInput: EmailVerificationFormInput,
): Promise<'invalid-input' | 'not-found' | 'error' | 'success'> {
    try {
        const validatedInput = emailVerificationSchema.safeParse(rawInput);
        if (!validatedInput.success) return 'invalid-input';

        const user = await getUserByEmail({ email: validatedInput.data.email });
        if (!user) return 'not-found';

        const emailVerificationToken = crypto.randomBytes(32).toString('base64url');

        const userUpdated = await prisma.user.update({
            where: {
                email: validatedInput.data.email,
            },
            data: {
                emailVerificationToken,
            },
        });

        const emailSent = await resend.emails.send({
            from: env.RESEND_EMAIL_FROM,
            to: [validatedInput.data.email],
            subject: 'Verify your email address',
            react: EmailVerificationEmail({
                email: validatedInput.data.email,
                emailVerificationToken,
            }),
        });

        return userUpdated && emailSent ? 'success' : 'error';
    } catch (error) {
        console.error(error);
        throw new Error('Error resending email verification link');
    }
}
