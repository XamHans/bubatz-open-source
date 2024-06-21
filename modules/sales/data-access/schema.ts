import { members } from '@/modules/members/data-access/schema';
import { plants } from '@/modules/plants/data-access/schema';
import { sql } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  time,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const paymentMethods = pgEnum('paymentMethods', [
  'CASH',
  'CARD',
  'WALLET',
]);

export const sales = pgTable('sales', {
  id: serial('id').primaryKey(),
  totalPrice: real('total_price').notNull(),
  paidVia: paymentMethods('paid_via').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => members.id),
  salesById: uuid('sales_by_id')
    .notNull()
    .references(() => members.id),
  createdAt: timestamp('created_at').notNull().defaultNow(), // Not yet updated on the db
  updatedAt: timestamp('updated_at').notNull().defaultNow(), // Not yet updated on the db
});

export const salesItems = pgTable('sales_items', {
  id: serial('id').primaryKey(),
  weightGrams: real('weight_grams').notNull(),
  price: real('price').notNull(),
  plantId: uuid('plant_id')
    .notNull()
    .references(() => plants.id),
  saleId: integer('sale_id')
    .notNull()
    .references(() => sales.id),
});

/**
 * * Relations
 */
export const salesRelations = relations(sales, ({ many, one }) => ({
  user: one(members, {
    fields: [sales.userId],
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
    fields: [salesItems.plantId],
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
  weightGrams: (schema) => schema.weightGrams.positive().min(0),
  price: (schema) => schema.price.positive().min(0),
  plantId: (schema) => schema.plantId.uuid(),
  saleId: (schema) => schema.saleId.positive(),
});
// export const SaleItemInsertSchemaArray = z.array(SaleItemInsertSchema);
export type SaleItemInsertSchema = z.infer<typeof SaleItemInsertSchema>;

export const SaleItemFormInputSchema = SaleItemInsertSchema.omit({
  saleId: true,
});

export type SaleItem = z.infer<typeof SaleItemFormInputSchema>;

/**
 * * Sales
 */
export const createSaleInputSchema = createInsertSchema(sales, {
  totalPrice: (schema) => schema.totalPrice.positive().min(0),
  paidVia: (schema) => schema.paidVia,
  userId: (schema) => schema.userId.uuid(),
  salesById: (schema) => schema.salesById.uuid(),
});
export type CreateSaleInput = z.infer<typeof createSaleInputSchema>;

export const createSaleFormInputSchema = createInsertSchema(sales, {
  totalPrice: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: 'Expected number, received a string',
  }),
  paidVia: (schema) => schema.paidVia,
  userId: (schema) => schema.userId.uuid(),
});

export type CreateSaleFormInput = z.infer<typeof createSaleFormInputSchema>;

export const getSaleSchema = createSelectSchema(sales);
export type Sale = z.infer<typeof getSaleSchema>;

// * Payment methods
export const PaymentMethodsEnum = z.enum(paymentMethods.enumValues);
export type PaymentMethodsType = z.infer<typeof PaymentMethodsEnum>;
