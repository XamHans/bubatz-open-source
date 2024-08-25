'use server';

import {
  createMember,
  createMemberPayment,
  deleteMember,
  deleteMemberPayment,
  getAllPayments,
  getMemberPaymentDetails,
  getMemberPayments,
  getMembers,
  updateMember,
  updateMemberPayment,
} from '../data-access';

import { actionClient } from '@/lib/server-clients';
import { z } from 'zod';
import {
  MembershipPaymentSchema,
  UserSchema,
  addMemberInputSchema,
  createMemberPaymentInputSchema,
  deleteMemberInputSchema,
  updateMemberInputSchema,
  updateMemberPaymentInputSchema,
} from '../data-access/schema';

export const addMemberUseCase = actionClient
  .schema(addMemberInputSchema)
  .action(async ({ parsedInput }) => {
    if (!parsedInput) {
      return { failure: 'No data provided, cant create new member' };
    }
    const newMemberId: UserSchema[] = await createMember({
      ...parsedInput,
    });
    return { success: newMemberId };
  });

export const fetchMembersUseCase = actionClient.action(async () => {
  const members: UserSchema[] = await getMembers();

  return { success: members };
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

export const fetchAllPaymentsUseCase = actionClient.action(async () => {
  try {
    const payments = await getAllPayments();
    return { success: payments };
  } catch (error) {
    return { failure: 'Failed to fetch payments' };
  }
});

export const fetchPaymentsFromMemberUseCase = actionClient
  .schema(z.object({ memberId: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    try {
      const payments: MembershipPaymentSchema[] = await getMemberPayments(
        parsedInput.memberId,
      );

      return { success: payments };
    } catch (error) {
      return {
        failure: `Failed to fetch payments for member ${parsedInput.memberId}`,
      };
    }
  });

export const addPaymentUseCase = actionClient
  .schema(createMemberPaymentInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const newPaymentId = await createMemberPayment({
        ...parsedInput,
      });
      return { success: newPaymentId };
    } catch (error) {
      return { failure: 'Failed to create new payment' };
    }
  });

export const updatePaymentUseCase = actionClient
  .schema(updateMemberPaymentInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const updatedPayment = await updateMemberPayment(parsedInput);
      return { success: updatedPayment };
    } catch (error) {
      console.error('Error updating payment:', error);
      return { failure: `Failed to update payment: ${error}` };
    }
  });

export const fetchPaymentDetailsUseCase = actionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    try {
      const paymentDetails = await getMemberPaymentDetails(parsedInput.id);

      return { success: paymentDetails };
    } catch (error) {
      console.error('Error fetching payment details:', error);
      return { failure: `Failed to fetch payment details: ${error}` };
    }
  });

export const deleteMemberPaymentUseCase = actionClient
  .schema(deleteMemberInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const deletedPayment = await deleteMemberPayment(parsedInput.id);
      return { success: deletedPayment };
    } catch (error) {
      console.error('Error deleting payment:', error);
      return { failure: `Failed to delete payment: ${error}` };
    }
  });
