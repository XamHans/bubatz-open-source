'use server';

import { logger } from '@/lib/logger';
import { actionClient } from '@/lib/server-clients';
import {
  createSale,
  createSaleItem,
  getSaleWithoutItemsById,
  getSales,
} from '../data-access';
import {
  SaleItemInsertSchema,
  SaleWithItems,
  SaleWithoutItems,
  getSaleSchema,
} from '../data-access/schema';

/**
 * Get all sales.
 * @returns Array of all sales.
 */
export const fetchSalesUseCase = actionClient.action(async () => {
  const sales = await getSales();
  return { sales: sales };
});

/**
 * Get a sale by its id.
 * @returns Sale with the given id. If no sale is found, return null.
 */
export const fetchSaleUseCase = actionClient
  .schema(getSaleSchema)
  .action(
    async ({ parsedInput }): Promise<{ sale?: SaleWithoutItems | null }> => {
      logger.debug('Fetching sale from DB.');
      const sale = await getSaleWithoutItemsById(parsedInput.id);
      return { sale: sale };
    },
  );

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
