import {
  MemberProps,
  members,
  protectedSchema,
} from '@/modules/members/data-access/schema'
import { strains } from '@/modules/plants/data-access/schema'
import {
  integer,
  pgEnum,
  real,
  serial,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { z } from 'zod'

// Enums
export const paymentMethods = pgEnum('paymentMethods', ['CASH', 'CARD'])

// Table Definitions
export const sales = protectedSchema.table('sales', {
  id: serial('id').primaryKey(),
  totalPrice: real('total_price').default(0).notNull(),
  totalAmount: real('total_amount').default(0).notNull(),
  paidVia: paymentMethods('paid_via').notNull(),
  memberId: uuid('member_id')
    .notNull()
    .references(() => members.id),
  salesById: uuid('sales_by_id')
    .notNull()
    .references(() => members.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const salesItems = protectedSchema.table('sales_items', {
  id: serial('id').primaryKey(),
  amount: real('amount').notNull(),
  price: real('price').notNull(),
  strainId: integer('strain_id').notNull(),
  saleId: integer('sale_id')
    .notNull()
    .references(() => sales.id),
})

// Relations
export const salesMemberRelations = relations(sales, ({ many, one }) => ({
  user: one(members, {
    fields: [sales.memberId],
    references: [members.id],
  }),
  transactions: many(salesItems),
  seller: one(members, {
    fields: [sales.salesById],
    references: [members.id],
  }),
}))

export const salesStrainsRelations = relations(salesItems, ({ one }) => ({
  sale: one(sales, {
    fields: [salesItems.saleId],
    references: [sales.id],
  }),
  strain: one(strains, {
    fields: [salesItems.strainId],
    references: [strains.id],
  }),
}))

// Schemas
// Sales Schemas
export const createSaleInputSchema = z.object({
  totalPrice: z.number().positive(),
  paidVia: z.enum(paymentMethods.enumValues),
  memberId: z.string().uuid(),
  salesById: z.string().uuid(),
})

export const updateSaleInputSchema = z.object({
  id: z.number().positive(),
  totalAmount: z.number().positive().optional(),
  totalPrice: z.number().positive().optional(),
  paidVia: z.enum(paymentMethods.enumValues).optional(),
  memberId: z.string().uuid().optional(),
  salesById: z.string().uuid().optional(),
})

export const deleteSaleInputSchema = z.object({
  id: z.number().positive(),
})

export const getSalesSchema = z.object({
  id: z.number(),
  totalPrice: z.number(),
  totalAmount: z.number(),
  paidVia: z.enum(paymentMethods.enumValues),
  memberId: z.string().uuid(),
  salesById: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const getSaleDetailSchema = z.object({
  id: z.number().positive(),
})

// Sales Items Schemas
export const createSaleItemInputSchema = z.object({
  amount: z.number().positive(),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        if (isNaN(parsed)) {
          throw new Error('Invalid price format')
        }
        return parsed
      }
      return val
    })
    .refine((val) => val > 0, {
      message: 'Price must be a positive number',
    }),
  strainId: z.number(),
  saleId: z.number().positive(),
})

export const updateSaleItemInputSchema = z.object({
  id: z.number().positive(),
  amount: z.number().positive().optional(),
  price: z.number().positive().optional(),
  strainId: z.number().optional(),
  saleId: z.number().positive().optional(),
})

export const deleteSaleItemInputSchema = z.object({
  id: z.number().positive(),
})

export const getSalesItemsSchema = z.object({
  id: z.number(),
  amount: z.number(),
  price: z.number(),
  strainId: z.number(),
  saleId: z.number(),
})

export const getSaleItemDetailSchema = z.object({
  id: z.number().positive(),
})

// Combined Schema for Creating a Sale with Items
export const createSaleWithItemsInputSchema = createSaleInputSchema.extend({
  items: z.array(createSaleItemInputSchema.omit({ saleId: true })).min(1),
})

// Additional Schemas
export const fetchMembersStrainAmountInputSchema = z.object({
  memberId: z.string().uuid(),
  month: z.number().int().optional(),
  year: z.number().int().optional(),
})

export const checkIfMemberIsAllowedForStrainInputSchema = z.object({
  memberId: z.string().uuid(),
  strainId: z.number().int(),
})

// Types
export type SaleProps = z.infer<typeof getSalesSchema>
export type CreateSaleInput = z.infer<typeof createSaleInputSchema>
export type UpdateSaleInput = z.infer<typeof updateSaleInputSchema>
export type DeleteSaleInput = z.infer<typeof deleteSaleInputSchema>

export type SaleDetailProps = SaleProps & {
  member: MemberProps
  soldBy: MemberProps
  items: SaleItemProps[]
}

export type SaleItemProps = z.infer<typeof getSalesItemsSchema>
export type CreateSaleItemInput = z.infer<typeof createSaleItemInputSchema>
export type UpdateSaleItemInput = z.infer<typeof updateSaleItemInputSchema>
export type DeleteSaleItemInput = z.infer<typeof deleteSaleItemInputSchema>

export type CreateSaleWithItemsInput = z.infer<
  typeof createSaleWithItemsInputSchema
>
export type FetchMembersStrainAmountInput = z.infer<
  typeof fetchMembersStrainAmountInputSchema
>
export type CheckIfMemberIsAllowedForStrainInput = z.infer<
  typeof checkIfMemberIsAllowedForStrainInputSchema
>
