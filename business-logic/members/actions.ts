'use server';

import { AsyncReturnType } from '@/lib/types';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { members } from './schema';
const connectionString = process.env.DATABASE_URL
const client = postgres(connectionString!, { prepare: false })
const db = drizzle(client);


const getMembers = async () => {
    const allMembers = await db.select().from(members);
    return allMembers;
}
export type GetMembersQueryData = AsyncReturnType<typeof getMembers>


const getMemberDetail = async (id: string) => {
    const foundMembers = await db.select().from(members).where(eq(members.id, id)).limit(1);
    console.log('getMemberDetail' , foundMembers)
    return foundMembers[0];
}
export type GetMemberDetailQueryData = AsyncReturnType<typeof getMemberDetail>


export { getMemberDetail, getMembers };

