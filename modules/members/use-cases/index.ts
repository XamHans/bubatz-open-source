'use server'

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
} from '../data-access'

import { actionClient } from '@/lib/server-clients'
import { z } from 'zod'
import {
  MembershipPaymentSchema,
  UserSchema,
  addMemberInputSchema,
  createMemberPaymentInputSchema,
  deleteMemberInputSchema,
  updateMemberInputSchema,
  updateMemberPaymentInputSchema,
} from '../data-access/schema'

export const addMemberUseCase = actionClient
  .schema(addMemberInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const newMemberResult = await createMember(parsedInput)
      return { success: newMemberResult }
    } catch (error) {
      throw new Error(`Failed to create new member ${error}`)
    }
  })

export const fetchMembersUseCase = actionClient.action(async () => {
  try {
    const members: UserSchema[] = (await getMembers()) as any
    return { success: members }
  } catch (error) {
    throw new Error(`Failed to fetch members: ${error}`)
  }
})

export const updateMemberUseCase = actionClient
  .schema(updateMemberInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const updatedMember = await updateMember(parsedInput)
      return { success: updatedMember }
    } catch (error) {
      throw new Error(`Failed to update member: ${error}`)
    }
  })

export const deleteMemberUseCase = actionClient
  .schema(deleteMemberInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const deletedMember = await deleteMember(parsedInput.id)
      return { success: deletedMember }
    } catch (error) {
      throw new Error(`Failed to delete member: ${error}`)
    }
  })

//--------PAYMENTS

export const fetchAllPaymentsUseCase = actionClient.action(async () => {
  try {
    const payments = await getAllPayments()
    return { success: payments }
  } catch (error) {
    throw new Error(`Failed to fetch all payments: ${error}`)
  }
})

export const fetchPaymentsFromMemberUseCase = actionClient
  .schema(z.object({ memberId: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    try {
      const payments: MembershipPaymentSchema[] = (await getMemberPayments(
        parsedInput.memberId,
      )) as any
      return { success: payments }
    } catch (error) {
      throw new Error(`Failed to fetch member payments: ${error}`)
    }
  })

export const addPaymentUseCase = actionClient
  .schema(createMemberPaymentInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const newPaymentId = await createMemberPayment({
        ...parsedInput,
      })
      return { success: newPaymentId }
    } catch (error) {
      throw new Error(`Failed to create payment: ${error}`)
    }
  })

export const updatePaymentUseCase = actionClient
  .schema(updateMemberPaymentInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const updatedPayment = await updateMemberPayment(parsedInput)
      return { success: updatedPayment }
    } catch (error) {
      throw new Error(`Failed to update payment: ${error}`)
    }
  })

export const fetchPaymentDetailsUseCase = actionClient
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    try {
      const paymentDetails = await getMemberPaymentDetails(parsedInput.id)
      if (!paymentDetails) {
        throw new Error(`Payment details not found for id: ${parsedInput.id}`)
      }
      return { success: paymentDetails }
    } catch (error) {
      throw new Error(`Failed to fetch payment details: ${error}`)
    }
  })

export const deleteMemberPaymentUseCase = actionClient
  .schema(deleteMemberInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const deletedPayment = await deleteMemberPayment(parsedInput.id)
      return { success: deletedPayment }
    } catch (error) {
      throw new Error(`Failed to delete payment: ${error}`)
    }
  })
