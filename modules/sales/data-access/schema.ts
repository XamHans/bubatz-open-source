import { members, protectedSchema } from '@/modules/members/data-access/schema';
import { MemberProps } from '@/modules/members/types';
import { strains } from '@/modules/plants/data-access/schema';
import {
  integer,
  pgEnum,
  real,
  serial,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const paymentMethods = pgEnum('paymentMethods', ['CASH', 'CARD']);

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
});

export const salesItems = protectedSchema.table('sales_items', {
  id: serial('id').primaryKey(),
  amount: real('amount').notNull(),
  price: real('price').notNull(),
  strainId: integer('strain_id').notNull(), // Removed the foreign key constraint
  saleId: integer('sale_id')
    .notNull()
    .references(() => sales.id),
});

/**
 * * Relations
 */
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
}));

export const salesStrainsRelations = relations(salesItems, ({ one }) => ({
  sale: one(sales, {
    fields: [salesItems.saleId],
    references: [sales.id],
  }),
  strain: one(strains, {
    fields: [salesItems.strainId],
    references: [strains.id],
  }),
}));

export const createSaleInputSchema = createInsertSchema(sales, {
  totalAmount: z.number().positive(),
  totalPrice: z.number().positive(),
  paidVia: z.enum(paymentMethods.enumValues),
  memberId: z.string().uuid(),
  salesById: z.string().uuid(),
});

export const updateSaleInputSchema = createSelectSchema(sales)
  .partial()
  .extend({
    id: z.number().positive(),
  });

export const deleteSaleInputSchema = createSelectSchema(sales).pick({
  id: true,
});

export const getSalesSchema = createSelectSchema(sales);

export const getSaleDetailSchema = updateSaleInputSchema.pick({ id: true });

// Sales Items Schemas
export const createSaleItemInputSchema = createInsertSchema(salesItems, {
  amount: z.number().positive(),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val);
        if (isNaN(parsed)) {
          throw new Error('Invalid price format');
        }
        return parsed;
      }
      return val;
    })
    .refine((val) => val > 0, {
      message: 'Price must be a positive number',
    }),
  strainId: z.number(),
  saleId: z.number().positive(),
});

export const updateSaleItemInputSchema = createSelectSchema(salesItems)
  .partial()
  .extend({
    id: z.number().positive(),
  });

export const deleteSaleItemInputSchema = createSelectSchema(salesItems).pick({
  id: true,
});

export const getSalesItemsSchema = createSelectSchema(salesItems);

export const getSaleItemDetailSchema = updateSaleItemInputSchema.pick({
  id: true,
});

// Combined Schema for Creating a Sale with Items
export const createSaleWithItemsInputSchema = createSaleInputSchema.extend({
  items: z.array(createSaleItemInputSchema.omit({ saleId: true })).min(1),
});

export const fetchMembersStrainAmountInputSchema = z.object({
  memberId: z.string().uuid(),
  month: z.number().int().optional(),
  year: z.number().int().optional(),
});

export const checkIfMemberIsAllowedForStrainInputSchema = z.object({
  memberId: z.string().uuid(),
  strainId: z.number().int(),
});

// Types
export type SaleProps = z.infer<typeof getSalesSchema>;
export type CreateSaleInput = z.infer<typeof createSaleInputSchema>;
export type UpdateSaleInput = z.infer<typeof updateSaleInputSchema>;
export type DeleteSaleInput = z.infer<typeof deleteSaleInputSchema>;

export type SaleDetailProps = SaleProps & {
  member: MemberProps;
  soldBy: MemberProps;
  items: SaleItemProps[];
};

export type SaleItemProps = z.infer<typeof getSalesItemsSchema>;
export type CreateSaleItemInput = z.infer<typeof createSaleItemInputSchema>;
export type UpdateSaleItemInput = z.infer<typeof updateSaleItemInputSchema>;
export type DeleteSaleItemInput = z.infer<typeof deleteSaleItemInputSchema>;

export type CreateSaleWithItemsInput = z.infer<
  typeof createSaleWithItemsInputSchema
>;
export type FetchMembersStrainAmountInput = z.infer<
  typeof fetchMembersStrainAmountInputSchema
>;
export type CheckIfMemberIsAllowedForStrainInput = z.infer<
  typeof checkIfMemberIsAllowedForStrainInputSchema
>;
