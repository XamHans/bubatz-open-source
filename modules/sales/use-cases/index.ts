'use server';

import { actionClient } from '@/lib/server-clients';
import { z } from 'zod';
import {
  createSaleWithItems,
  getMemberSales,
  getMemberStrainAmount,
  getSales,
} from '../data-access';
import { createSaleWithItemsInputSchema, fetchMembersStrainAmountInputSchema } from '../data-access/schema';

export const fetchAllSalesUseCase = actionClient.action(async () => {
  try {
    const sales = await getSales();
    return { success: sales };
  } catch (error) {
    console.log('Error fetching sales', error);
    return { failure: 'Failed to fetch sales' };
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
    if (!parsedInput?.memberId) {
      return { failure: 'No member ID provided, cannot fetch sales' };
    }
    try {
      const totalAmountOfStrainPerMonth = await getMemberStrainAmount(parsedInput);

      return { success: totalAmountOfStrainPerMonth };
    } catch (error) {
      return {
        failure: `Failed to fetch sales for member ${parsedInput.memberId}`,
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