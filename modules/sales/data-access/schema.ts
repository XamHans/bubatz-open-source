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
  createdAt: time('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: time('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const salesItems = pgTable('sales_items', {
  id: serial('id').primaryKey(),
  quantity: real('quantity').notNull(),
  weightGrams: real('weight_grams').notNull(),
  price: real('price').notNull(),
  plantId: integer('plant_id')
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

export const createSaleInputSchema = createInsertSchema(sales, {
  totalPrice: (schema) => schema.totalPrice.positive(),
  paidVia: (schema) => schema.paidVia,
  userId: (schema) => schema.userId.uuid(),
  salesById: (schema) => schema.salesById.uuid(),
  createdAt: (schema) => schema.createdAt.optional(),
  updatedAt: (schema) => schema.updatedAt.optional(),
});
export type CreateSaleInput = z.infer<typeof createSaleInputSchema>;

export const createSaleItemInputSchema = createInsertSchema(salesItems, {
  quantity: (schema) => schema.quantity.positive(),
  weightGrams: (schema) => schema.weightGrams.positive(),
  price: (schema) => schema.price.positive(),
  plantId: (schema) => schema.plantId.positive().optional(),
  saleId: (schema) => schema.saleId.positive().optional(),
});
export type CreateSaleItemInput = z.infer<typeof createSaleItemInputSchema>;

export const getSaleSchema = createSelectSchema(sales);
export type Sale = z.infer<typeof getSaleSchema>;

const paymentMethodsSchema = z.enum(paymentMethods.enumValues);
export type PaymentMethodsEnum = z.infer<typeof paymentMethodsSchema>;
