'use server';

import { createSafeActionClient } from 'next-safe-action';
import {
  Sale,
  createSaleInputSchema,
  getSaleSchema,
} from '../data-access/schema';
import getLogger from '@/lib/logger';
import { createSale, getSaleById, getSales } from '../data-access';

const action = createSafeActionClient();

/**
 * Get all sales.
 * @returns Array of all sales.
 */
export async function fetchSalesUseCase(): Promise<Sale[]> {
  console.info('Fetching sales from DB.');
  const { sales }: { sales: Sale[] } = await getSales();
  return sales;
}

/**
 * Get a sale by its id.
 * @param id Id of the sale to be retrieved.
 * @returns Sale with the given id. If no sale is found, return null.
 */
export const fetchSaleUseCase = action(
  getSaleSchema,
  async (id: { id: number }): Promise<{ sale?: Sale | null }> => {
    getLogger().debug('Fetching sale from DB.');
    const sale = await getSaleById(id.id);
    return { sale: sale };
  },
);

/**
 * Create a new sale.
 * @param newSaleData Data of the new sale to be created.
 * @returns Object with sale in case of success, or failure otherwise.
 */
export const createSaleUseCase = action(
  createSaleInputSchema,
  async (newSaleData): Promise<{ success?: Sale; failure?: string }> => {
    if (!newSaleData) {
      return { failure: 'No data provided, cant create new sale' };
    }
    newSaleData = {
      ...newSaleData,
      id: 0,
    };
    // getLogger().debug('Creating new sale createSaleUseCase', newSaleData);
    const newSaleId: Sale | null = await createSale(newSaleData);

    return newSaleId
      ? { success: newSaleId }
      : { failure: 'Error creating sale' };
  },
);
