'use server';

import { DEFAULT_SERVER_ERROR, createSafeActionClient } from 'next-safe-action';
import {
  SaleWithoutItems,
  SaleItemInsertSchema,
  SaleWithItems,
  createSaleInputSchema,
  getSaleSchema,
} from '../data-access/schema';
import { logger } from '@/lib/logger';
import {
  createSale,
  createSaleItem,
  getSaleWithoutItemsById,
  getSales,
} from '../data-access';

const action = createSafeActionClient({
  handleReturnedServerError: (error) => {
    console.error('Error returned from server:', error.message);
    return DEFAULT_SERVER_ERROR;
  },
});

/**
 * Get all sales.
 * @returns Array of all sales.
 */
export const fetchSalesUseCase = action({}, async () => {
  const sales = await getSales();
  return { sales: sales };
});

/**
 * Get a sale by its id.
 * @param id Id of the sale to be retrieved.
 * @returns Sale with the given id. If no sale is found, return null.
 */
export const fetchSaleUseCase = action(
  getSaleSchema,
  async (id: { id: number }): Promise<{ sale?: SaleWithoutItems | null }> => {
    logger.debug('Fetching sale from DB.');
    const sale = await getSaleWithoutItemsById(id.id);
    return { sale: sale };
  },
);

/**
 * Create a new sale.
 * @param newSaleData Data of the new sale to be created.
 * @returns Object with sale in case of success, or failure otherwise.
 */
export const createSaleUseCase = action(SaleWithItems, async (newSaleData) => {
  if (!newSaleData) {
    return { failure: 'No data provided, cant create new sale' };
  }
  console.log('newSaleData', newSaleData);
  const result = await createSale(newSaleData);

  return { success: result };
});

export const createSaleItemUseCase = action(
  SaleItemInsertSchema,
  async (item) => {
    if (!item) return { failure: 'No data provided, cant create new item' };

    const newItem = await createSaleItem(item);
    return { success: newItem };
  },
);
