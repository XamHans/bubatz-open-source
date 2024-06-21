'use server';

import { db } from '@/lib/db/db';
// import getLogger from '@/lib/logger';
import { AddMemberInput, members } from './schema';
import { AsyncReturnType } from '@/lib/types';
import { UpdateMemberInput } from '../types';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
// const logger = getLogger();
/**
 * Here is an example CRUD methods for the members table.
 * If you plan to keep your code base "clean", we recommend
 * no where else know about dizzle other than your data-access directory.
 */
const getMembers = async () => {
  const allMembers = await db.select().from(members);
  console.log('allmembers', allMembers);
  return allMembers;
};

export const createMember = async (input: AddMemberInput) => {
  // logger.debug('Creating new member', input);
  const newMemberId = await db
    .insert(members)
    .values({
      ...input,
      phone: input.phone || '', // Set phone to an empty string if it's undefined
    })
    .returning({ insertedId: members.id });
  return newMemberId;
};

const getMemberDetail = async (id: string) => {
  const foundMembers = await db
    .select()
    .from(members)
    .where(eq(members.id, id))
    .limit(1);
  console.log('getMemberDetail', foundMembers);
  return foundMembers[0];
};
export type GetMemberDetailQueryData = AsyncReturnType<typeof getMemberDetail>;

const updateMember = async (id: string, data: UpdateMemberInput) => {
  try {
    const updatedMemberResult = await db
      .update(members)
      .set({ ...data, birthday: data.birthday.toString() })
      .where(eq(members.id, id));
    console.log('updateMember', updatedMemberResult);
    return 'Success';
  } catch (error) {
    console.error('Error updating member:', error);
    return { message: 'Failed to update member', error: error };
  }
};

export { getMemberDetail, getMembers, updateMember };
