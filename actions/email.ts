import { db } from '@/lib/db/db'
import { users } from '@/lib/db/schema'
import {
    MarkEmailAsVerifiedInput,
    markEmailAsVerifiedSchema,
} from '@/validations/email'
import { eq } from 'drizzle-orm/sql/expressions/conditions'

export async function markEmailAsVerified(
    rawInput: MarkEmailAsVerifiedInput
): Promise<'invalid-input' | 'error' | 'success'> {
    try {
        const validatedInput = markEmailAsVerifiedSchema.safeParse(rawInput)
        if (!validatedInput.success) return 'invalid-input'

        const userUpdated = await db
            .update(users)
            .set({
                emailVerified: new Date(),
                emailVerificationToken: null,
            })
            .where(eq(users.emailVerificationToken, validatedInput.data.token))

        return userUpdated ? 'success' : 'error'
    } catch (error) {
        console.error(error)
        throw new Error('Error marking email as verified')
    }
}
