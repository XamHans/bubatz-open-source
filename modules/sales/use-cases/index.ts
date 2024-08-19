'use server';

import { logger } from '@/lib/logger';
import { actionClient } from '@/lib/server-clients';
import { z } from 'zod';
import {
  checkIfMemberIsAllowedForStrain,
  createSaleWithItems,
  getMemberSales,
  getMemberStrainAmount,
  getSaleDetails,
  getSales,
} from '../data-access';
import { checkIfMemberIsAllowedForStrainInputSchema, createSaleWithItemsInputSchema, fetchMembersStrainAmountInputSchema } from '../data-access/schema';

export const fetchAllSalesUseCase = actionClient.action(async () => {
  try {
    const sales = await getSales();
    return { success: sales };
  } catch (error) {
    console.log('Error fetching sales', error);
    return { failure: 'Failed to fetch sales' };
  }
});

export const fetchSaleDetailsUseCase = actionClient
  .schema(z.object({ saleId: z.number().int() }))
  .action(async ({ parsedInput }) => {

    try {
      const saleDetail = await getSaleDetails(parsedInput.saleId);
      console.log('saleDetail from query', saleDetail)
      return { success: saleDetail };
    } catch (error) {
      logger.error(error)
      return {
        failure: `Failed to fetch sales details for sale id ${parsedInput.saleId}`,
      };
    }
  });

export const fetchMemberSalesUseCase = actionClient
  .schema(z.object({ memberId: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    if (!parsedInput?.memberId) {
      return { failure: 'No member ID provided, cannot fetch sales' };
    }
    try {
      const sales = await getMemberSales(parsedInput.memberId);

      return { success: sales };
    } catch (error) {
      return {
        failure: `Failed to fetch sales for member ${parsedInput.memberId}`,
      };
    }
  });

export const fetchMembersStrainAmountUseCase = actionClient
  .schema(fetchMembersStrainAmountInputSchema)
  .action(async ({ parsedInput }) => {

    try {
      const totalAmountOfStrainPerMonth = await getMemberStrainAmount(parsedInput);

      return { success: totalAmountOfStrainPerMonth };
    } catch (error) {
      return {
        failure: `Failed to fetch sales for member ${parsedInput.memberId}`,
      };
    }
  });

export const checkIfMemberIsAllowedForStrainUseCase = actionClient
  .schema(checkIfMemberIsAllowedForStrainInputSchema)
  .action(async ({ parsedInput }) => {

    try {
      const isAllowed = await checkIfMemberIsAllowedForStrain(parsedInput);

      return { success: isAllowed };
    } catch (error) {
      console.log(error)
      return {
        failure: `Failed to check if member is allowed for strain ${error}`,
      };
    }
  });


export const createSaleUseCase = actionClient
  .schema(createSaleWithItemsInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const result = await createSaleWithItems(parsedInput);
      return { success: result };
    } catch (error) {
      console.error('Error creating sale:', error);
      return { failure: 'Failed to create sale: ' + (error instanceof Error ? error.message : String(error)) };
    }
  });