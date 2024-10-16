'use server'

import { db } from '@/lib/db/db'
import { members } from '@/modules/members/data-access/schema'
import { strains } from '@/modules/plants/data-access/schema' // Import the strains table
import { and, eq, gte, lt, sql } from 'drizzle-orm'
import { cache } from 'react'
import {
  CheckIfMemberIsAllowedForStrainInput,
  CreateSaleInput,
  CreateSaleItemInput,
  CreateSaleWithItemsInput,
  FetchMembersStrainAmountInput,
  sales,
  salesItems,
} from './schema'

export const getSales = cache(async () => {
  const allSales = await db
    .select({
      id: sales.id,
      totalPrice: sales.totalPrice,
      paidVia: sales.paidVia,
      createdAt: sales.createdAt,
      memberName: sql`${members.firstName} || ' ' || ${members.lastName}`.as(
        'memberName',
      ),
      memberId: members.id,
      salesById: sales.salesById,
    })
    .from(sales)
    .leftJoin(members, eq(sales.memberId, members.id))

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
        .where(eq(salesItems.saleId, sale.id))

      const admin = await db
        .select({
          fullName: sql`${members.firstName} || ' ' || ${members.lastName}`.as(
            'fullName',
          ),
        })
        .from(members)
        .where(eq(members.id, sale.salesById))
        .limit(1)

      return {
        ...sale,
        items,
        adminName: admin[0]?.fullName || 'Unknown',
      }
    }),
  )

  return salesWithDetails
})

export const getMemberSales = cache(async (memberId: string) => {
  const memberSales = await db
    .select({
      id: sales.id,
      memberId: sales.memberId,
      adminId: sales.salesById,
      adminName: sql`${members.firstName} || ' ' || ${members.lastName}`.as(
        'adminName',
      ),
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
    .where(eq(sales.memberId, memberId))

  return memberSales
})

export const getSaleDetails = cache(async (saleId: number) => {
  const [sale] = await db
    .select({
      id: sales.id,
      totalPrice: sales.totalPrice,
      totalAmount: sales.totalAmount,
      paidVia: sales.paidVia,
      createdAt: sales.createdAt,
      updatedAt: sales.updatedAt,
      memberId: sales.memberId,
      salesById: sales.salesById,
    })
    .from(sales)
    .where(eq(sales.id, saleId))
    .limit(1)

  if (!sale) {
    return null
  }

  // Buyer query
  const [buyer] = await db
    .select({
      id: members.id,
      fullName: sql`${members.firstName} || ' ' || ${members.lastName}`.as(
        'fullName',
      ),
    })
    .from(members)
    .where(eq(members.id, sale.memberId))
    .limit(1)

  // Seller query
  const [seller] = await db
    .select({
      id: members.id,
      fullName: sql`${members.firstName} || ' ' || ${members.lastName}`.as(
        'fullName',
      ),
    })
    .from(members)
    .where(eq(members.id, sale.salesById))
    .limit(1)

  // Items query
  const items = await db
    .select({
      id: salesItems.id,
      amount: salesItems.amount,
      price: salesItems.price,
      strainId: salesItems.strainId,
      strainName: strains.name,
      thc: strains.thc,
      cbd: strains.cbd,
    })
    .from(salesItems)
    .leftJoin(strains, eq(salesItems.strainId, strains.id))
    .where(eq(salesItems.saleId, saleId))

  return {
    ...sale,
    buyer,
    seller,
    items,
  }
})

export const checkIfMemberIsAllowedForStrain = cache(
  async (input: CheckIfMemberIsAllowedForStrainInput) => {
    const result = await db
      .select({
        isAllowed: sql<boolean>`
      CASE
        WHEN ${members.birthday} IS NULL THEN false
        WHEN ${strains.thc} IS NULL THEN false
        WHEN DATE_PART('year', AGE(CURRENT_DATE, ${members.birthday})) BETWEEN 18 AND 21 
          AND ${strains.thc} >= 15 THEN false
        WHEN DATE_PART('year', AGE(CURRENT_DATE, ${members.birthday})) < 18 THEN false
        ELSE true
      END
    `.as('isAllowed'),
      })
      .from(members)
      .leftJoin(strains, eq(strains.id, input.strainId))
      .where(eq(members.id, input.memberId))
      .execute()

    return result[0]?.isAllowed ?? false
  },
)

export const getMemberStrainAmount = cache(
  async (input: FetchMembersStrainAmountInput) => {
    const currentDate = new Date()
    const year = input.year ?? currentDate.getFullYear()
    const month = input.month ?? currentDate.getMonth() + 1 // getMonth() returns 0-11

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const totalAmountOfStrain = await db
      .select({
        totalAmount: sql<number>`COALESCE(SUM(${sales.totalAmount}), 0)`.as(
          'totalAmount',
        ),
      })
      .from(sales)
      .where(
        and(
          eq(sales.memberId, input.memberId),
          gte(sales.createdAt, startDate),
          lt(sales.createdAt, endDate),
        ),
      )
      .execute()

    return totalAmountOfStrain[0]?.totalAmount || 0
  },
)

async function validateSale(
  saleData: CreateSaleInput,
  items: CreateSaleItemInput[],
) {
  // ... (keep the existing validation logic)
}

export async function createSaleWithItems(input: CreateSaleWithItemsInput) {
  const { items, ...saleData } = input
  await validateSale(saleData, items)

  const saleTransactionResult = await db.transaction(async (tx) => {
    // Create the sale record
    const [createdSale] = await tx
      .insert(sales)
      .values(saleData as any)
      .returning()

    if (!createdSale) {
      throw new Error('Failed to create sale record')
    }

    // Create sale items
    const saleItemsData = items.map((item) => ({
      ...item,
      saleId: createdSale.id,
    }))

    const createdSaleItems = await tx
      .insert(salesItems)
      //@ts-ignore
      .values(saleItemsData)
      .returning()

    if (createdSaleItems.length !== items.length) {
      throw new Error('Failed to create all sale items')
    }

    // Update strain amounts
    for (const item of createdSaleItems) {
      const [strain] = await tx
        .select()
        .from(strains)
        .where(eq(strains.id, item.strainId))
        .limit(1)

      if (!strain) {
        throw new Error(`Strain with id ${item.strainId} not found`)
      }

      if (strain && Number(strain.amountAvailable) < item.amount) {
        throw new Error(`Not enough ${strain.name} available`)
      }

      // Update the amount available in the strains table
      await tx
        .update(strains)
        //@ts-ignore
        .set({ amountAvailable: strain.amountAvailable - item.amount })
        .where(eq(strains.id, item.strainId))
    }

    // Update the total amount and price in the sale record
    const totalAmount = createdSaleItems.reduce(
      (sum, item) => sum + item.amount,
      0,
    )
    const totalPrice = createdSaleItems.reduce(
      (sum, item) => sum + item.price * item.amount,
      0,
    )

    const [updatedSale] = await tx
      .update(sales)
      .set({ totalAmount, totalPrice })
      .where(eq(sales.id, createdSale.id))
      .returning()

    return {
      sale: updatedSale,
      saleItems: createdSaleItems,
    }
  })

  console.log('Sale created:', saleTransactionResult)
  return saleTransactionResult.sale.id
}
