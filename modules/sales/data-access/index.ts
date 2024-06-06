'use server';

import { db } from '@/lib/db/db';
import { CreateSaleInput, Sale, sales } from './schema';
import { eq } from 'drizzle-orm';

/**
 * Get all sales.
 * @returns Array of all sales.
 */
export const getSales = async () => {
  const allSales: Sale[] = await db.select().from(sales);
  console.log('allsales', allSales);
  return { sales: allSales };
};

/**
 * Get a sale by its id.
 * @param id Id of the sale to be retrieved.
 * @returns Sale with the given id. If no sale is found, return null.
 */
export const getSaleById = async (id: number): Promise<Sale | null> => {
  const sale: Sale[] = await db.select().from(sales).where(eq(sales.id, id));
  console.log('sale', sale);
  return sale[0] ?? null;
};

/**
 *
 * @param sale Sale to be created.
 * @returns Created sale. If an error occurs, return null.
 */
export const createSale = async (
  sale: CreateSaleInput,
): Promise<Sale | null> => {
  return await db.transaction(async (tx) => {
    try {
      const newSale: Sale = (
        await tx.insert(sales).values(sale).returning()
      )[0];
      console.log('newSale', newSale);
      return newSale;
    } catch (error) {
      tx.rollback();
      console.error('Error creating sale', error);
      return null;
    }
  });
};
