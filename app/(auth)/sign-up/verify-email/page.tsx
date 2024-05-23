import { getUserByEmailVerificationToken } from '@/actions/user'
import { db } from '@/lib/db/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm/sql/expressions/conditions'
import { usePathname } from 'next/dist/client/components/navigation'
import { useState } from 'react'

export default async function VerifyEmailPage() {
    const pathname = usePathname()

    const params = new URLSearchParams(pathname)

    const token = params.get('token') as string

    const user = await getUserByEmailVerificationToken({ token })

    const result = await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id))
        .returning()
    return (
        <div>
            <h1>Email Verify Email</h1>
        </div>
    )
}
