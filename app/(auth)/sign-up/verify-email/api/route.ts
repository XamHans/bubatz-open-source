import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmailVerificationToken } from '@/actions/user'
import { db } from '@/lib/db/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm/sql/expressions/conditions'
import { sql } from 'drizzle-orm/sql/sql'

export async function POST(req: NextRequest, res: NextResponse) {
    const url = new URL(req.url)
    const params = new URLSearchParams(url.search)

    const token = params.get('token') as string

    const user = await getUserByEmailVerificationToken({ token })

    if (!user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    const result = await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id))
        .returning()

    return NextResponse.json({ data: user }, { status: 200 })
}
