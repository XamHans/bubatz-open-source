'use server';

import { createMember, getMembers } from '../data-access';

import getLogger from '@/lib/logger';
import { createSafeActionClient } from 'next-safe-action';
import { addMemberInputSchema } from '../data-access/schema';
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
  getLogger().debug('Creating new member addMemberUseCase');
  const members = await getMembers();
  return { members: members };
});
