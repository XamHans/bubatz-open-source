'use server';

import { db } from '@/lib/db/db';
import {
  CreateSaleInput,
  SaleWithoutItems,
  SaleItemInsertSchema,
  TSaleWithItems,
  sales,
  salesItems,
  Sale,
  SaleItem,
} from './schema';
import { eq } from 'drizzle-orm';
import { AsyncReturnType } from '@/lib/types';

/**
 * Get all sales.
 * @returns Array of all sales.
 */
export const getSales = async () => {
  const allSales: SaleWithoutItems[] = await db.select().from(sales);
  return allSales;
};

/**
 * Get a sale by its id.
 * @param id Id of the sale to be retrieved.
 * @returns Sale with the given id. If no sale is found, return null.
 */
export const getSaleWithoutItemsById = async (
  id: number,
): Promise<SaleWithoutItems | null> => {
  const sale: SaleWithoutItems[] = await db
    .select()
    .from(sales)
    .where(eq(sales.id, id));
  console.log('sale', sale);
  return sale[0] ?? null;
};
export type GetSaleWithoutItemsQueryData = AsyncReturnType<
  typeof getSaleWithoutItemsById
>;

export const getSaleById = async (id: number): Promise<Sale> => {
  const sale: SaleWithoutItems[] = await db
    .select()
    .from(sales)
    .where(eq(sales.id, id));
  console.log('sale', sale);
  const items = await getSaleItemsBySaleId(id);
  return { sale: sale[0], items: items };
};

export type GetSaleDetailQueryData = AsyncReturnType<
  typeof getSaleWithoutItemsById
>;

export const getSaleItemsBySaleId = async (id: number): Promise<SaleItem[]> => {
  const items: SaleItem[] = await db
    .select()
    .from(salesItems)
    .where(eq(salesItems.saleId, id));
  console.log('sale', items);
  return items;
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
 * @param sale Sale to be created.
 * @returns Created sale. If an error occurs, return null.
 */
export const createSale = async (
  sale: TSaleWithItems,
): Promise<TSaleWithItems | null> => {
  console.log('Inserting in DB: ', sale);

  return db.transaction(async (trx) => {
    try {
      const newSale = await trx.insert(sales).values(sale.sale).returning();

      const mappedSaleItems = sale.items.map((item) => ({
        ...item,
        saleId: newSale[0].id,
      }));

      const saleItems = await trx
        .insert(salesItems)
        .values(mappedSaleItems)
        .returning();

      return { sale: newSale[0], items: saleItems };
    } catch (error) {
      console.error('Error creating sale: ', error);
      trx.rollback();
      return null;
    }
  });
};
