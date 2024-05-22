'use server';

import { AsyncReturnType } from '@/lib/types';
import { DB_SUCCESS, Either, UpdateError, left, right } from '@/types/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { members } from './schema';
import { UpdateMemberInput } from './types';
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



const updateMember = async (id: string, data: UpdateMemberInput): Promise<Either<UpdateError, DB_SUCCESS>> => {
    try {
    const updatedMemberResult = await db.update(members).set({ ...data }).where(eq(members.id, id));
    console.log('updateMember', updatedMemberResult);
    return right('DB_SUCCESS');
  } catch (error) {
    console.error('Error updating member:', error);
    return left({ message: 'Failed to update member', error: error });
  }
}



export { getMemberDetail, getMembers, updateMember };

