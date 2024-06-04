'use server';

import { createMember, getMembers } from '../data-access';

import getLogger from '@/lib/logger';
import { createSafeActionClient } from 'next-safe-action';
import { UserSchema, addMemberInputSchema } from '../data-access/schema';
import { get } from 'http';
import { MemberProps } from '../types';
const action = createSafeActionClient();

// This schema is used to validate input from client.

export const addMemberUseCase = action(
  addMemberInputSchema,
  async ({ ...data }) => {
    console.log('data', data);
    if (!data) {
      return { failure: 'No data provided, cant create new member' };
    }
    getLogger().debug('Creating new member addMemberUseCase', data);
    const newMemberId = await createMember(data);
    return { success: newMemberId };
  },
);

export const fetchMembersUseCase = action({}, async () => {
  getLogger().debug('Fetching members from database');
  const members: UserSchema[] = await getMembers();

  const parsedMembers: MemberProps[] = members.map((member) => {
    return { ...member, birthday: new Date(member.birthday) };
  });

  return { members: parsedMembers };
});
