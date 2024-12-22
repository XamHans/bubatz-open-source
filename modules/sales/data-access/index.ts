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
class ValidationError extends Error {
  code: string

  constructor({ code, message }: { code: string; message: string }) {
    super(message)
    this.code = code
    this.name = 'ValidationError'
  }
}

async function validateSale(
  saleData: CreateSaleInput,
  items: CreateSaleItemInput[],
): Promise<void> {
  // Get member details
  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.id, saleData.memberId))
    .limit(1)

  if (!member) {
    throw new ValidationError({
      code: 'MEMBER_NOT_FOUND',
      message: 'Only members are allowed to receive cannabis',
    })
  }

  // Check age
  const age = calculateAge(new Date(member.birthday))
  if (age < 18) {
    throw new ValidationError({
      code: 'UNDERAGE',
      message: 'Cannabis can only be distributed to adults',
    })
  }

  // Calculate total amount for this sale
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  // Check daily limit (25g)
  const todaysSales = await getTodaysSales(member.id)
  const todaysTotal = todaysSales.reduce(
    (sum, sale) => sum + sale.totalAmount,
    0,
  )

  if (todaysTotal + totalAmount > 25) {
    throw new ValidationError({
      code: 'DAILY_LIMIT_EXCEEDED',
      message: 'Daily limit of 25g would be exceeded',
    })
  }

  // Check monthly limit (50g for 21+, 30g for 18-20)
  const monthlyLimit = age >= 21 ? 50 : 30
  const monthSales = await getMonthSales(member.id)
  const monthTotal = monthSales.reduce((sum, sale) => sum + sale.totalAmount, 0)

  if (monthTotal + totalAmount > monthlyLimit) {
    throw new ValidationError({
      code: 'MONTHLY_LIMIT_EXCEEDED',
      message: `Monthly limit of ${monthlyLimit}g would be exceeded`,
    })
  }

  // Check THC content for young adults (18-20)
  if (age < 21) {
    for (const item of items) {
      const [strain] = await db
        .select()
        .from(strains)
        .where(eq(strains.id, item.strainId))
        .limit(1)

      if (+strain.thc > 10) {
        throw new ValidationError({
          code: 'THC_CONTENT_TOO_HIGH',
          message: 'THC content too high for members under 21',
        })
      }
    }
  }

  // Validate strains availability
  for (const item of items) {
    const [strain] = await db
      .select()
      .from(strains)
      .where(eq(strains.id, item.strainId))
      .limit(1)

    if (!strain) {
      throw new ValidationError({
        code: 'STRAIN_NOT_FOUND',
        message: `Strain with id ${item.strainId} not found`,
      })
    }

    if (Number(strain.amountAvailable) < item.amount) {
      throw new ValidationError({
        code: 'INSUFFICIENT_STOCK',
        message: `Not enough ${strain.name} available`,
      })
    }
  }
}

export async function createSaleWithItems(input: CreateSaleWithItemsInput) {
  const { items, ...saleData } = input

  try {
    await validateSale(saleData, items)

    const saleTransactionResult = await db.transaction(async (tx) => {
      // Create the sale record
      const [createdSale] = await tx
        .insert(sales)
        .values(saleData as any)
        .returning()

      if (!createdSale) {
        throw new ValidationError({
          code: 'SALE_CREATION_FAILED',
          message: 'Failed to create sale record',
        })
      }

      // Create sale items
      const saleItemsData = items.map((item) => ({
        ...item,
        saleId: createdSale.id,
      }))

      const createdSaleItems = await tx
        .insert(salesItems)
        .values(saleItemsData as any)
        .returning()

      if (createdSaleItems.length !== items.length) {
        throw new ValidationError({
          code: 'SALE_ITEMS_CREATION_FAILED',
          message: 'Failed to create all sale items',
        })
      }

      // Update strain amounts
      for (const item of createdSaleItems) {
        await tx
          .update(strains)
          .set({
            amountAvailable: sql`${strains.amountAvailable} - ${item.amount}`,
          })
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

    return saleTransactionResult.sale.id
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    throw new ValidationError({
      code: 'UNKNOWN_ERROR',
      message: `Failed to process sale: ${error.message}`,
    })
  }
}

// Helper functions
async function getTodaysSales(memberId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return db
    .select()
    .from(sales)
    .where(and(eq(sales.memberId, memberId), gte(sales.createdAt, today)))
}

async function getMonthSales(memberId: string) {
  const firstDayOfMonth = new Date()
  firstDayOfMonth.setDate(1)
  firstDayOfMonth.setHours(0, 0, 0, 0)

  return db
    .select()
    .from(sales)
    .where(
      and(eq(sales.memberId, memberId), gte(sales.createdAt, firstDayOfMonth)),
    )
}

function calculateAge(dateOfBirth: Date): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--
  }

  return age
}
