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
  updateMemberPaymentInputSchema
} from '../data-access/schema';

export const addMemberUseCase = actionClient
  .schema(addMemberInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const newMemberResult = await createMember(parsedInput);
      return { success: newMemberResult };
    }
    catch (error) {
      return { failure: `Failed to create new member ${error}` };
    }
  });

export const fetchMembersUseCase = actionClient.action(async () => {
  const members: UserSchema[] = await getMembers();

  return { success: members };
});

export const updateMemberUseCase = actionClient
  .schema(updateMemberInputSchema)
  .action(async ({ parsedInput }) => {

    const updatedMember = await updateMember(parsedInput);
    return { success: updatedMember };
  });

export const deleteMemberUseCase = actionClient
  .schema(deleteMemberInputSchema)
  .action(async ({ parsedInput }) => {

    const deletedMember = await deleteMember(parsedInput.id);
    return { success: deletedMember };
  });

//--------PAYMENTS

export const fetchAllPaymentsUseCase = actionClient.action(async () => {
  const payments = await getAllPayments();
  return { success: payments };
});

export const fetchPaymentsFromMemberUseCase = actionClient
  .schema(z.object({ memberId: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const payments: MembershipPaymentSchema[] = await getMemberPayments(
      parsedInput.memberId,
    );

    return { success: payments };
  });

export const addPaymentUseCase = actionClient
  .schema(createMemberPaymentInputSchema)
  .action(async ({ parsedInput }) => {
    const newPaymentId = await createMemberPayment({
      ...parsedInput,
    });
    return { success: newPaymentId };
  });

export const updatePaymentUseCase = actionClient
  .schema(updateMemberPaymentInputSchema)
  .action(async ({ parsedInput }) => {
    const updatedPayment = await updateMemberPayment(parsedInput);
    return { success: updatedPayment };
  });

export const fetchPaymentDetailsUseCase = actionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const paymentDetails = await getMemberPaymentDetails(parsedInput.id);

    return { success: paymentDetails };
  });

export const deleteMemberPaymentUseCase = actionClient
  .schema(deleteMemberInputSchema)
  .action(async ({ parsedInput }) => {
    const deletedPayment = await deleteMemberPayment(parsedInput.id);
    return { success: deletedPayment };
  });
