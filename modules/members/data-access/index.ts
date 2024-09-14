'use server'

// import getLogger from '../../../lib/logger';
import { db } from '@/lib/db/db'
import { AsyncReturnType } from '@/types'
import { format, parse } from 'date-fns'
import { eq } from 'drizzle-orm/sql/expressions/conditions'
import {
  AddMemberInput,
  AddMembershipPaymentInput,
  UpdateMemberInput,
  UpdateMemberPaymentInput,
  members,
  membershipPayments,
} from './schema'

// const logger = getLogger();
/**
 * Here is an example CRUD methods for the members table.
 * If you plan to keep your code base "clean", we recommend
 * no where else know about dizzle other than your data-access directory.
 */
const getMembers = async () => {
  const allMembers = await db.select().from(members)
  return allMembers
}

export const createMember = async (input: AddMemberInput) => {
  if (!input.birthday) {
    throw new Error('Birthday is required')
  }
  try {
    // Parse the input date string
    const parsedDate = parse(input.birthday, 'dd.MM.yyyy', new Date())

    // Format the date to ISO string format
    const formattedDate = format(parsedDate, 'yyyy-MM-dd')

    // Create a new object with the formatted date
    const memberData = {
      ...input,
      birthday: formattedDate,
    }

    const newMember = await db.insert(members).values(memberData).returning()
    return newMember[0]
  } catch (error) {
    console.error('Error creating member:', error)
    throw new Error('Failed to create new member')
  }
}

const getMemberDetail = async (id: string) => {
  const foundMembers = await db
    .select()
    .from(members)
    .where(eq(members.id, id))
    .limit(1)
  return foundMembers[0]
}
export type GetMemberDetailQueryData = AsyncReturnType<typeof getMemberDetail>

const updateMember = async (data: UpdateMemberInput) => {
  try {
    const updatedMemberResult = await db
      .update(members)
      //@ts-ignore
      .set({ ...data, birthday: data.birthday?.toString() }) // Added nullish coalescing operator
      .where(eq(members.id, data.id ?? ''))
      .returning()
    return updatedMemberResult
  } catch (error) {
    console.error('Error updating member:', error)
    return { message: 'Failed to update member', error: error }
  }
}

const deleteMember = async (id: string) => {
  try {
    const deletedMemberResult = await db
      .delete(members)
      .where(eq(members.id, id))
    console.log('deletedMember', deletedMemberResult)
    return deletedMemberResult
  } catch (error) {
    console.error('Error deleting member:', error)
    return { message: 'Failed to delete member', error: error }
  }
}

export { deleteMember, getMemberDetail, getMembers, updateMember }

//------------------------PAYMENTS
export const createMemberPayment = async (input: AddMembershipPaymentInput) => {
  // console.debug('Creating new member', input);
  const newPaymentId = await db
    .insert(membershipPayments)
    .values(input as any)
    .returning()
  return newPaymentId
}

export const getAllPayments = async () => {
  const payments = await db
    .select()
    .from(membershipPayments)
    .leftJoin(members, eq(membershipPayments.memberId, members.id))

  return payments
}

export const getMemberPayments = async (memberId: string) => {
  const payments = await db
    .select()
    .from(membershipPayments)
    .where(eq(membershipPayments.memberId, memberId))

  return payments
}

export const getMemberPaymentDetails = async (id: string) => {
  const paymentDetails = await db
    .select()
    .from(membershipPayments)
    .where(eq(membershipPayments.id, id))
    .limit(1)

  return paymentDetails[0]
}

export const updateMemberPayment = async (data: UpdateMemberPaymentInput) => {
  console.log('updatePayment data', data)
  const updatedPaymentResult = await db
    .update(membershipPayments)
    // @ts-ignore
    .set({ ...data })
    .where(eq(membershipPayments.id, data.id ?? ''))
  console.log('updatedPaymentResult', updatedPaymentResult)
  return updatedPaymentResult
}

export const deleteMemberPayment = async (id: string) => {
  const deletedPaymentResult = await db
    .delete(membershipPayments)
    .where(eq(membershipPayments.id, id))
  return deletedPaymentResult
}
