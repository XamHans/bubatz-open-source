import { transactions } from "@/modules/sales/data-access/schema";
import { pgTable, real, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const plants = pgTable('transactions', {
    id: serial('id').primaryKey(),
    name: text('quantity').notNull(),
    price: real('price').notNull(),
});

export const plantsRelations = relations(plants, ({many}) => ({
    transactions: many(transactions),
}))

export const createPlantInputSchema = createInsertSchema(plants, {
    /**
     * TODO: To be implemented
     */
});

export const getPlantInputSchema = createSelectSchema(plants, {
    /**
     * TODO: To be implemented
     */
});

export type CreatePlantInput = z.infer<typeof createPlantInputSchema>
export type GetPlantInput = z.infer<typeof getPlantInputSchema>