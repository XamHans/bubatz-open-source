'use server';

import {
  createMember,
  deleteMember,
  getMembers,
  updateMember,
} from '../data-access';

// import getLogger from '../../../lib/logger';
import { createSafeActionClient } from 'next-safe-action';
import {
  UserSchema,
  addMemberInputSchema,
  deleteMemberInputSchema,
  selectMultipleUsersSchema,
  selectUserSchema,
  updateMemberInputSchema,
} from '../data-access/schema';
import { get } from 'http';
import { MemberProps } from '../types';
import { z } from 'zod';
const action = createSafeActionClient();

// This schema is used to validate input from client.

export const addMemberUseCase = action(
  addMemberInputSchema,
  async ({ ...data }) => {
    if (!data) {
      return { failure: 'No data provided, cant create new member' };
    }
    // getLogger().debug('Creating new member addMemberUseCase', data);
    const newMemberId: UserSchema[] = await createMember({
      ...data,
      id: crypto.randomUUID(),
    });
    return { success: newMemberId };
  },
);

export const fetchMembersUseCase = action({}, async () => {
  // getLogger().debug('Fetching members from database');
  const members: UserSchema[] = await getMembers();

  const parsedMembers: UserSchema[] = members.map((member) => {
    return { ...member };
  });

  return { members: parsedMembers };
});

export const updateMemberUseCase = action(
  updateMemberInputSchema,
  async ({ ...data }) => {
    console.log('data', data);
    if (!data) {
      return { failure: 'No data provided, cant update member' };
    }
    // getLogger().debug('Updating member updateMemberUseCase', data);
    const updatedMember = await updateMember(data);
    return { success: updatedMember };
  },
);

export const deleteMemberUseCase = action(
  deleteMemberInputSchema,
  async ({ id }) => {
    console.log('id', id);
    if (!id) {
      return { failure: 'No data provided, cant delete member' };
    }
    const deletedMember = await deleteMember(id);
    return { success: deletedMember };
  },
);
