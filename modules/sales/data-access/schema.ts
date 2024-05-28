import { members } from "@/modules/members/data-access/schema";
import { plants } from "@/modules/plants/data-access/schema";
import { integer, pgTable, serial, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const sales = pgTable('sales', {
    id: serial('id').primaryKey(),
    amount: integer('amount').notNull(),
    userId: uuid('user_id').notNull(),
});

export const transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    quantity: integer('quantity').notNull(),
    plantId: integer('plant_id').notNull(),
    saleId: integer('sale_id').notNull(),
});

export const salesRelations = relations(sales, ({many, one}) => ({
    user: one(members, {
        fields: [sales.userId],
        references: [members.id]
    }),
    transactions: many(transactions),
}))

export const transactionsRelations = relations(transactions, ({one}) => ({
    sale: one(sales, {
        fields: [transactions.saleId],
        references: [sales.id]
    }),
    plant: one(plants, {
        fields: [transactions.plantId],
        references: [plants.id]
    }),
}))

export const createSaleInputSchema = createInsertSchema(sales, {
    /**
     * TODO: To be implemented
     */
});

export const getSaleInputSchema = createSelectSchema(sales, {
    /**
     * TODO: To be implemented
     */
})

export type CreateSaleInput = z.infer<typeof createSaleInputSchema>
export type GetSaleInput = z.infer<typeof getSaleInputSchema>