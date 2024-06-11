'use server';

import { db } from '@/lib/db/db';
import getLogger from '@/lib/logger';
import { AddMemberInput, members } from './schema';
import { AsyncReturnType } from '@/lib/types';
import { UpdateMemberInput } from './schema';
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

const updateMember = async (data: UpdateMemberInput) => {
  try {
    const updatedMemberResult = await db
      .update(members)
      .set({ ...data, birthday: data.birthday?.toString() }) // Added nullish coalescing operator
      .where(eq(members.id, data.id ?? ''));
    console.log('updatedMemberResult', updatedMemberResult);
    return 'Success';
  } catch (error) {
    console.error('Error updating member:', error);
    return { message: 'Failed to update member', error: error };
  }
};

const deleteMember = async (id: string) => {
  try {
    const deletedMember = await db.delete(members).where(eq(members.id, id));
    console.log('deletedMember', deletedMember);
    return 'Deleted member successfully';
  } catch (error) {
    console.error('Error deleting member:', error);
    return { message: 'Failed to delete member', error: error };
  }
};

export { getMemberDetail, getMembers, updateMember, deleteMember };
