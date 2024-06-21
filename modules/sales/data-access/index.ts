'use server';

import { db } from '@/lib/db/db';
import {
  CreateSaleInput,
  Sale,
  SaleItemInsertSchema,
  sales,
  salesItems,
} from './schema';
import { eq } from 'drizzle-orm';

/**
 * Get all sales.
 * @returns Array of all sales.
 */
export const getSales = async () => {
  const allSales: Sale[] = await db.select().from(sales);
  console.log('allsales', allSales);
  return allSales;
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

export const createSaleItem = async (
  saleItem: SaleItemInsertSchema,
): Promise<SaleItemInsertSchema> => {
  console.log('Inserting in DB: ', saleItem);
  const newSaleItems: SaleItemInsertSchema[] = await db
    .insert(salesItems)
    .values(saleItem)
    .returning();

  return newSaleItems[0];
};

/**
 *
 * @param sale Sale to be created.
 * @returns Created sale. If an error occurs, return null.
 */
export const createSale = async (sale: CreateSaleInput): Promise<Sale> => {
  console.log('Inserting in DB: ', sale);
  const newSale: Sale[] = await db.insert(sales).values(sale).returning();
  return newSale[0];
};
