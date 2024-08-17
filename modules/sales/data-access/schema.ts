import { members, protectedSchema } from '@/modules/members/data-access/schema';
import { plants } from '@/modules/plants/data-access/schema';
import {
  integer,
  pgEnum,
  real,
  serial,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const paymentMethods = pgEnum('paymentMethods', [
  'CASH',
  'CARD',
  'WALLET',
]);

export const sales = protectedSchema.table('sales', {
  id: serial('id').primaryKey(),
  totalPrice: real('total_price').notNull(),
  paidVia: paymentMethods('paid_via').notNull(),
  memberId: uuid('member_id')
    .notNull()
    .references(() => members.id),
  salesById: uuid('sales_by_id')
    .notNull()
    .references(() => members.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(), // Not yet updated on the db
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(), // Not yet updated on the db
});

export const salesItems = protectedSchema.table('sales_items', {
  id: serial('id').primaryKey(),
  weightGrams: real('weight_grams').notNull(),
  price: real('price').notNull(),
  strainId: integer('strain_id').notNull(), // Removed the foreign key constraint
  saleId: integer('sale_id')
    .notNull()
    .references(() => sales.id),
});

/**
 * * Relations
 */
export const salesRelations = relations(sales, ({ many, one }) => ({
  user: one(members, {
    fields: [sales.memberId],
    references: [members.id],
  }),
  transactions: many(salesItems),
  seller: one(members, {
    fields: [sales.salesById],
    references: [members.id],
  }),
}));

export const salesItemsRelations = relations(salesItems, ({ one }) => ({
  sale: one(sales, {
    fields: [salesItems.saleId],
    references: [sales.id],
  }),
  plant: one(plants, {
    fields: [salesItems.strainId],
    references: [plants.id],
  }),
}));

/**
 * * Input schemas
 */

/**
 * * Sale Items
 */
export const SaleItemInsertSchema = createInsertSchema(salesItems, {
  weightGrams: z.coerce.number().positive().min(0),
  price: z.coerce.number().positive().min(0),
  strainId: z.coerce.number().positive().min(0),
  saleId: (schema) => schema.saleId.optional(),
});

export type SaleItemInsertSchema = z.infer<typeof SaleItemInsertSchema>;

export const SaleItemFormInputSchema = SaleItemInsertSchema.omit({});

export type SaleItem = z.infer<typeof SaleItemFormInputSchema>;

/**
 * * Sales
 */

export const createSaleInputSchema = createInsertSchema(sales, {
  totalPrice: (schema) => schema.totalPrice.positive().min(0),
  paidVia: (schema) => schema.paidVia,
  memberId: (schema) => schema.memberId.uuid(),
  salesById: (schema) => schema.salesById,
});
export type CreateSaleInput = z.infer<typeof createSaleInputSchema>;

export const createSaleFormInputSchema = createInsertSchema(sales, {
  totalPrice: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: 'Expected number, received a string',
  }),
  paidVia: (schema) => schema.paidVia,
  memberId: (schema) => schema.memberId.uuid(),
});

export type CreateSaleFormInput = z.infer<typeof createSaleFormInputSchema>;

export const SaleWithItems = z.object({
  sale: z.object({
    totalPrice: z.number().positive().min(0),
    paidVia: z.enum(paymentMethods.enumValues),
    memberId: z.string().uuid(),
    salesById: z.string().uuid(),
  }),
  items: z.array(SaleItemInsertSchema),
});

export type TSaleWithItems = z.infer<typeof SaleWithItems>;

export const getSaleSchema = createSelectSchema(sales);
export type SaleWithoutItems = z.infer<typeof getSaleSchema>;

export const Sale = z.object({
  sale: createSaleInputSchema,
  items: z.array(SaleItemInsertSchema),
});

export type Sale = z.infer<typeof Sale>;

// * Payment methods
export const PaymentMethodsEnum = z.enum(paymentMethods.enumValues);
export type PaymentMethodsType = z.infer<typeof PaymentMethodsEnum>;
