'use server';

import { createMember, getMembers, updateMember } from '../data-access';

import getLogger from '@/lib/logger';
import { createSafeActionClient } from 'next-safe-action';
import {
  UserSchema,
  addMemberInputSchema,
  updateMemberInputSchema,
} from '../data-access/schema';
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

  const parsedMembers: UserSchema[] = members.map((member) => {
    return { ...member };
  });

  return { members: parsedMembers };
});

// export const updateMemberUseCase = action(
//   updateMemberInputSchema,
//   async (id: string, { ...data }) => {
//     console.log('data', data);
//     if (!data) {
//       return { failure: 'No data provided, cant update member' };
//     }
//     getLogger().debug('Updating member updateMemberUseCase', data);
//     const updatedMember = await updateMember(data, id);
//     return { success: updatedMember };
//   },
// );

export const updateMemberUseCase = action(
  updateMemberInputSchema,
  async ({ ...data }) => {
    console.log('data', data);
    if (!data) {
      return { failure: 'No data provided, cant update member' };
    }
    getLogger().debug('Updating member updateMemberUseCase', data);
    const updatedMember = await updateMember(data);
    return { success: updatedMember };
  },
);
