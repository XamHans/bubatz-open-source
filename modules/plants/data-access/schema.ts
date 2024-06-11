import { salesItems } from '@/modules/sales/data-access/schema';
import { jsonb, pgTable, real, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { sql } from 'drizzle-orm/sql';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const defaultSeedToSale = {
  seed: {
    date_planted: null,
    source: null,
    seed_lot: null,
  },
  germination: {
    date_germinated: null,
    conditions: {
      temperature: null,
      humidity: null,
      light_hours: null,
    },
  },
  vegetative: {
    start_date: null,
    end_date: null,
    conditions: {
      temperature: null,
      humidity: null,
      light_hours: null,
    },
    nutrients: {
      type: null,
      schedule: null,
      ph_level: null,
    },
  },
  flowering: {
    start_date: null,
    estimated_end_date: null,
    conditions: {
      temperature: null,
      humidity: null,
      light_hours: null,
    },
    nutrients: {
      type: null,
      schedule: null,
      ph_level: null,
    },
  },
  harvest: {
    estimated_date: null,
    actual_date: null,
    yield_estimate_grams: null,
    yield_actual_grams: null,
    drying_conditions: {
      temperature: null,
      humidity: null,
    },
  },
  processing: {
    drying_start_date: null,
    drying_end_date: null,
    curing_start_date: null,
    curing_end_date: null,
    trim_date: null,
    packaging_date: null,
    final_weight_grams: null,
  },
  destroyed: {
    weight_grams_destroyed: null,
    destroyed_date: null,
    reason: null,
  },
};

export const plants = pgTable('plants', {
  id: serial('id').primaryKey(),
  name: text('quantity').notNull(),
  pricePerGram: real('price_per_gram').notNull(),
  strain: text('strain').notNull(),
  batchId: text('batch_id').notNull(), // ? Should be a table of its own in the future ?
  currentGrowtStage: text('current_growth_stage').notNull(),
  seedToSale: jsonb('seed_to_sale').notNull().default(defaultSeedToSale),
});

export const plantsRelations = relations(plants, ({ many }) => ({
  transactions: many(salesItems),
}));

/**
 * * Input schemas
 */

export const createPlantInputSchema = createInsertSchema(plants, {
  name: z.string().min(1),
  pricePerGram: z.number().positive(),
  strain: z.string().min(1),
  batchId: z.string().min(1),
  currentGrowtStage: z.string().min(1),
  seedToSale: z.object({}).default(defaultSeedToSale),
});

export const getPlantInputSchema = createSelectSchema(plants);

export type CreatePlantInput = z.infer<typeof createPlantInputSchema>;
export type GetPlantInput = z.infer<typeof getPlantInputSchema>;
