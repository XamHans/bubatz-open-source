'use server';

import { db } from '@/lib/db/db';
import { members } from '@/modules/members/data-access/schema';
import { strains } from '@/modules/plants/data-access/schema';
import { and, eq, gte, lt, sql } from 'drizzle-orm';
import { cache } from 'react';
import {
  CreateSaleWithItemsInput,
  FetchMembersStrainAmountInput,

  sales,
  salesItems
} from './schema';


export const getSales = cache(async () => {
  const allSales = await db
    .select({
      id: sales.id,
      totalPrice: sales.totalPrice,
      paidVia: sales.paidVia,
      createdAt: sales.createdAt,
      memberName: members.fullName,
      memberId: members.id,
      salesById: sales.salesById,
    })
    .from(sales)
    .leftJoin(members, eq(sales.memberId, members.id));

  const salesWithDetails = await Promise.all(
    allSales.map(async (sale) => {
      const items = await db
        .select({
          id: salesItems.id,
          amount: salesItems.amount,
          price: salesItems.price,
          strainName: strains.name,
        })
        .from(salesItems)
        .leftJoin(strains, eq(salesItems.strainId, strains.id))
        .where(eq(salesItems.saleId, sale.id));

      const admin = await db
        .select({
          fullName: members.fullName,
        })
        .from(members)
        .where(eq(members.id, sale.salesById))
        .limit(1);

      return {
        ...sale,
        items,
        adminName: admin[0]?.fullName || 'Unknown',
      };
    }),
  );


  return salesWithDetails;
});

export const getMemberSales = cache(async (memberId: string) => {
  const memberSales = await db
    .select({
      id: sales.id,
      memberId: sales.memberId,
      adminId: sales.salesById,
      adminName: members.fullName,
      strainId: salesItems.strainId,
      strainName: strains.name,
      quantity: salesItems.amount,
      price: salesItems.price,
      createdAt: sales.createdAt,
    })
    .from(sales)
    .leftJoin(salesItems, eq(sales.id, salesItems.saleId))
    .leftJoin(members, eq(sales.salesById, members.id))
    .leftJoin(strains, eq(salesItems.strainId, strains.id))
    .where(eq(sales.memberId, memberId));

  return memberSales;
});

export const getMemberStrainAmount = cache(async (input: FetchMembersStrainAmountInput) => {
  const currentDate = new Date();
  const year = input.year ?? currentDate.getFullYear();
  const month = input.month ?? currentDate.getMonth() + 1; // getMonth() returns 0-11

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const totalAmountOfStrain = await db
    .select({
      totalAmount: sql<number>`COALESCE(SUM(${sales.totalAmount}), 0)`.as('totalAmount'),
    })
    .from(sales)
    .where(
      and(
        eq(sales.memberId, input.memberId),
        gte(sales.createdAt, startDate),
        lt(sales.createdAt, endDate)
      )
    )
    .execute();

  return totalAmountOfStrain[0]?.totalAmount || 0;
});


export async function createSaleWithItems(input: CreateSaleWithItemsInput) {
  const { items, ...saleData } = input;

  return await db.transaction(async (tx) => {
    // Create the sale record
    const [createdSale] = await tx
      .insert(sales)
      .values(saleData)
      .returning();

    if (!createdSale) {
      throw new Error('Failed to create sale record');
    }

    // Create sale items
    const saleItemsData = items.map(item => ({
      ...item,
      saleId: createdSale.id
    }));

    const createdSaleItems = await tx
      .insert(salesItems)
      .values(saleItemsData)
      .returning();

    if (createdSaleItems.length !== items.length) {
      throw new Error('Failed to create all sale items');
    }

    // Update the total amount and price in the sale record
    const totalAmount = createdSaleItems.reduce((sum, item) => sum + item.amount, 0);
    const totalPrice = createdSaleItems.reduce((sum, item) => sum + item.price, 0);

    const [updatedSale] = await tx
      .update(sales)
      .set({ totalAmount, totalPrice })
      .where(eq(sales.id, createdSale.id))
      .returning();

    return {
      sale: updatedSale,
      saleItems: createdSaleItems
    };
  });
}