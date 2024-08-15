'use server';

import {
  createMember,
  deleteMember,
  getAllPayments,
  getMemberPayments,
  getMembers,
  updateMember,
} from '../data-access';

import { actionClient } from '@/lib/server-clients';
import { z } from 'zod';
import {
  MembershipPaymentSchema,
  UserSchema,
  addMemberInputSchema,
  deleteMemberInputSchema,
  updateMemberInputSchema
} from '../data-access/schema';

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



//--------PAYMENTS

export const fetchAllPaymentsUseCase = actionClient
  .schema(z.object({}))
  .action(async () => {
    try {
      const payments: MembershipPaymentSchema[] = await getAllPayments();
      const parsedPayments: MembershipPaymentSchema[] = payments.map((payment) => ({ ...payment }));
      return { success: parsedPayments };
    } catch (error) {
      return { failure: 'Failed to fetch payments' };
    }
  });

export const fetchMemberPaymentsUseCase = actionClient
  .schema(z.object({ memberId: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    if (!parsedInput?.memberId) {
      return { failure: 'No member ID provided, cannot fetch payments' };
    }
    try {
      const payments: MembershipPaymentSchema[] = await getMemberPayments(parsedInput.memberId);
      const parsedPayments: MembershipPaymentSchema[] = payments.map((payment) => ({ ...payment }));
      return { success: parsedPayments };
    } catch (error) {
      return { failure: `Failed to fetch payments for member ${parsedInput.memberId}` };
    }
  });

// export const addPaymentUseCase = actionClient
//   .schema(addPaymentInputSchema)
//   .action(async ({ parsedInput }) => {
//     if (!parsedInput) {
//       return { failure: 'No data provided, cannot create new payment' };
//     }
//     try {
//       const newPayment: MembershipPaymentSchema = await createPayment({
//         ...parsedInput,
//         id: crypto.randomUUID(),
//       });
//       return { success: newPayment };
//     } catch (error) {
//       return { failure: 'Failed to create new payment' };
//     }
//   });

// export const deletePaymentUseCase = actionClient
//   .schema(z.object({ id: z.string().uuid() }))
//   .action(async ({ parsedInput }) => {
//     if (!parsedInput.id) {
//       return { failure: 'No payment ID provided, cannot delete payment' };
//     }
//     try {
//       const deletedPayment = await deletePayment(parsedInput.id);
//       return { success: deletedPayment };
//     } catch (error) {
//       return { failure: `Failed to delete payment ${parsedInput.id}` };
//     }
//   });