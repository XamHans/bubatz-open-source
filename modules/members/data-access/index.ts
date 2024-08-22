'use server';

// import getLogger from '../../../lib/logger';
import { db } from '@/lib/db/db';
import { AsyncReturnType } from '@/types';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import {
  AddMemberInput,
  AddMembershipPaymentInput,
  UpdateMemberInput,
  members,
  membershipPayments,
} from './schema';
// const logger = getLogger();
/**
 * Here is an example CRUD methods for the members table.
 * If you plan to keep your code base "clean", we recommend
 * no where else know about dizzle other than your data-access directory.
 */
const getMembers = async () => {
  const allMembers = await db.select().from(members);
  return allMembers;
};

export const createMember = async (input: AddMemberInput) => {
  // logger.debug('Creating new member', input);
  const newMemberId = await db.insert(members).values(input).returning();
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
    console.log('data', data);
    const updatedMemberResult = await db
      .update(members)
      .set({ ...data, birthday: data.birthday?.toString() }) // Added nullish coalescing operator
      .where(eq(members.id, data.id ?? ''))
      .returning();
    console.log('updatedMemberResult', updatedMemberResult);
    return updatedMemberResult;
  } catch (error) {
    console.error('Error updating member:', error);
    return { message: 'Failed to update member', error: error };
  }
};

const deleteMember = async (id: string) => {
  try {
    const deletedMemberResult = await db
      .delete(members)
      .where(eq(members.id, id));
    console.log('deletedMember', deletedMemberResult);
    return deletedMemberResult;
  } catch (error) {
    console.error('Error deleting member:', error);
    return { message: 'Failed to delete member', error: error };
  }
};

export { deleteMember, getMemberDetail, getMembers, updateMember };

//------------------------PAYMENTS
export const createMemberPayment = async (input: AddMembershipPaymentInput) => {
  // logger.debug('Creating new member', input);
  const newPaymentId = await db
    .insert(membershipPayments)
    .values(input)
    .returning();
  return newPaymentId;
};

export const getAllPayments = async () => {
  const payments = await db
    .select()
    .from(membershipPayments)
    .leftJoin(members, eq(membershipPayments.memberId, members.id));

  return payments;
};

export type GetAllPaymentsQueryData = AsyncReturnType<typeof getAllPayments>;

export const getMemberPayments = async (memberId: string) => {
  const payments = await db
    .select()
    .from(membershipPayments)
    .where(eq(membershipPayments.memberId, memberId));

  return payments;
};

export type GetMemberPaymentsQueryData = AsyncReturnType<
  typeof getMemberPayments
>;

// If you need to update a payment, you can add a function like this:
export const updatePayment = async (data: UpdatePaymentInput) => {
  try {
    console.log('updatePayment data', data);
    const updatedPaymentResult = await db
      .update(membershipPayments)
      .set({ ...data })
      .where(eq(membershipPayments.id, data.id ?? ''));
    console.log('updatedPaymentResult', updatedPaymentResult);
    return 'Success';
  } catch (error) {
    console.error('Error updating payment:', error);
    return { message: 'Failed to update payment', error: error };
  }
};
