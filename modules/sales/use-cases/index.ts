'use server';

import { actionClient } from '@/lib/server-clients';
import { z } from 'zod';
import {
  createSale,
  createSaleItem,
  getMemberSales,
  getSales,
} from '../data-access';
import { SaleItemInsertSchema, SaleWithItems } from '../data-access/schema';

export const fetchAllSalesUseCase = actionClient.action(async () => {
  try {
    const sales = await getSales();
    return { success: sales };
  } catch (error) {
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
      const salesWithDetails = await Promise.all(
        sales.map(async (sale) => {
          const admin = await getUser(sale.salesById);
          const strain = await getStrain(sale.strainId);
          return {
            ...sale,
            adminName: admin?.name || 'Unknown',
            strainName: strain?.name || 'Unknown',
          };
        }),
      );
      return { success: salesWithDetails };
    } catch (error) {
      return {
        failure: `Failed to fetch sales for member ${parsedInput.memberId}`,
      };
    }
  });

/**
 * Create a new sale.
 * @returns Object with sale in case of success, or failure otherwise.
 */
export const createSaleUseCase = actionClient
  .schema(SaleWithItems)
  .action(async ({ parsedInput }) => {
    if (!parsedInput) {
      return { failure: 'No data provided, cant create new sale' };
    }
    console.log('newSaleData', parsedInput);
    const result = await createSale(parsedInput);

    return { success: result };
  });

export const createSaleItemUseCase = actionClient
  .schema(SaleItemInsertSchema)
  .action(async ({ parsedInput }) => {
    if (!parsedInput)
      return { failure: 'No data provided, cant create new item' };

    const newItem = await createSaleItem(parsedInput);
    return { success: newItem };
  });
