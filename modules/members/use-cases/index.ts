'use server';

import {
  createMember,
  deleteMember,
  getMembers,
  updateMember,
} from '../data-access';

import { actionClient } from '@/lib/server-clients';
import {
  UserSchema,
  addMemberInputSchema,
  deleteMemberInputSchema,
  selectMultipleUsersSchema,
  selectUserSchema,
  updateMemberInputSchema,
} from '../data-access/schema';
import { MemberProps } from '../types';
import { z } from 'zod';

export const addMemberUseCase = actionClient
  .schema(addMemberInputSchema)
  .action(async ({ parsedInput }) => {
    if (!parsedInput) {
      return { failure: 'No data provided, cant create new member' };
    }
    const newMemberId: UserSchema[] = await createMember({
      ...parsedInput,
      id: crypto.randomUUID(),
    });
    return { success: newMemberId };
  });

export const fetchMembersUseCase = actionClient
  .schema(z.object({}))
  .action(async () => {
    const members: UserSchema[] = await getMembers();
    const parsedMembers: UserSchema[] = members.map((member) => {
      return { ...member };
    });
    return { members: parsedMembers };
  });

export const updateMemberUseCase = actionClient
  .schema(updateMemberInputSchema)
  .action(async ({ parsedInput }) => {
    if (!parsedInput) {
      return { failure: 'No data provided, cant update member' };
    }
    const updatedMember = await updateMember(parsedInput);
    return { success: updatedMember };
  });

export const deleteMemberUseCase = actionClient
  .schema(deleteMemberInputSchema)
  .action(async ({ parsedInput }) => {
    if (!parsedInput.id) {
      return { failure: 'No data provided, cant delete member' };
    }
    const deletedMember = await deleteMember(parsedInput.id);
    return { success: deletedMember };
  });
