import { transactions } from '@/modules/sales/data-access/schema';
import { sql } from 'drizzle-orm';
import {
  date,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
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

export const batches = pgTable('batches', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  strain: text('strain').notNull(),
  startDate: date('start_date')
    .notNull()
    .default(sql`now()`),
  endDate: date('end_date').notNull(),
  currentGrowthStage: text('current_growth_stage').notNull(),
  pricePerGram: real('price_per_gram'),
  otherDetails: jsonb('other_details').default('{}'),
});

export const plants = pgTable('plants', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  batchId: uuid('batch_id')
    .notNull()
    .references(() => batches.id, { onDelete: 'cascade' }),
  position: text('position').notNull(),
  health: text('health').default('healthy'),
  seedToSale: jsonb('seed_to_sale').notNull().default(defaultSeedToSale),
});
export const batchesRelations = relations(batches, ({ many }) => ({
  plants: many(plants),
}));

export const batchesRelations = relations(batches, ({ many }) => ({
  plants: many(plants),
}));

export const plantsRelations = relations(plants, ({ many }) => ({
  transactions: many(transactions),
}));

export const createBatchInputSchema = createInsertSchema(batches, {
  name: z.string().min(1),
  startDate: z.date(),
  endDate: z.date().optional(),
  currentGrowthStage: z.string().min(1),

  otherDetails: z.object({}).optional(),
});

export const updateBatchInputSchema = createInsertSchema(batches, {
  name: z.string().min(1),
  startDate: z.date(),
  endDate: z.date().optional(),
  currentGrowthStage: z.string().min(1),
  pricePerGram: z.number().optional(),
  otherDetails: z.object({}).optional(),
});

export const createPlantInputSchema = createInsertSchema(plants, {
  name: z.string().min(1),
  batchId: z.string().optional(), // id is coming from context not from form
  position: z.string().min(1),
});

export const getBatchesSchema = createSelectSchema(batches);
export const getPlantsSchema = createSelectSchema(plants);

export type CreateBatchInput = z.infer<typeof createBatchInputSchema>;
export type UpdateBatchInput = z.infer<typeof updateBatchInputSchema>;

export type CreatePlantInput = z.infer<typeof createPlantInputSchema>;
export type GetBatches = z.infer<typeof getBatchesSchema>;
export type GetPlants = z.infer<typeof getPlantsSchema>;
