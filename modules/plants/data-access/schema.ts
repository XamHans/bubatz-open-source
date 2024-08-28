import { protectedSchema } from '@/modules/members/data-access/schema';
import { sql } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  serial,
  text,
  timestamp,
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
    drying_conditions: {
      temperature: null,
      humidity: null,
    },
  },
};

export const batches = protectedSchema.table('batches', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  strainId: integer('strain_id').references(() => strains.id),
  startDate: date('start_date')
    .notNull()
    .default(sql`CURRENT_DATE`),
  endDate: date('end_date'),
  currentGrowthStage: text('current_growth_stage').notNull().default('SEEDING'),
  totalYield: numeric('total_yield').default('0'),
  expectedYield: numeric('expected_yield').default('0'),
  totalDestroyed: numeric('total_destroyed').default('0'),
  isArchived: boolean('is_archived').default(false),
  otherDetails: jsonb('other_details').default('{}'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const plants = protectedSchema.table('plants', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  batchId: uuid('batch_id')
    .notNull()
    .references(() => batches.id, { onDelete: 'cascade' }),
  position: text('position').notNull(),
  health: text('health').default('HEALTHY'),
  yield: numeric('yield').default('0'),
  // seedToSale: jsonb('seed_to_sale').notNull().default(defaultSeedToSale),
});

export const strains = protectedSchema.table('strains', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  thc: numeric('thc').notNull(),
  cbd: numeric('cbd').notNull(),
  isArchived: boolean('is_archived').default(false),
  currentPricePerGram: numeric('current_price_per_gram').notNull(),
  amountAvailable: numeric('amount_available').default('0'), // amount available in grams
});

export const strainsRelation = relations(batches, ({ one }) => ({
  strain: one(strains, {
    fields: [batches.strainId],
    references: [strains.id],
  }),
}));

export const batchesRelations = relations(batches, ({ many }) => ({
  plants: many(plants),
}));

export const createBatchInputSchema = createInsertSchema(batches, {
  name: z.string().min(1),
  startDate: z.coerce.date().transform((date) => date.toISOString()),
  endDate: z.coerce
    .date()
    .transform((date) => date.toISOString())
    .optional(),
  currentGrowthStage: z.string().min(1),
  strainId: z.number().int(),
});

export const updateBatchInputSchema = createSelectSchema(batches)
  .partial()
  .extend({
    id: z.string().uuid(),
  });

export const createPlantInputSchema = createInsertSchema(plants, {
  name: z.string().min(1),
  batchId: z.string().min(1), // id is coming from context not from form
  position: z.string().min(1),
  health: z.string().optional().default('HEALTHY'),
});

export const updatePlantInputSchema = createSelectSchema(plants)
  .partial()
  .extend({
    id: z.number().positive(),
  });

export const deletePlantInputSchema = createPlantInputSchema.pick({
  id: true,
  batchId: true,
});

export const createStrainInputSchema = createInsertSchema(strains, {
  id: z.number().optional(),
  name: z.string().min(3),
  cbd: z.number().min(0),
  thc: z.number().min(0),
  description: z.string().optional(),
  currentPricePerGram: z.number().min(0).default(0),
  amountAvailable: z.number().min(0).default(0).optional(),
});

export const updateStrainInputSchema = createSelectSchema(strains)
  .partial()
  .extend({
    id: z.number().positive(),
  });

export const deleteStrainInputSchema = updateStrainInputSchema.pick({
  id: true,
});

export const getBatchesSchema = createSelectSchema(batches);
export const getPlantsSchema = createSelectSchema(plants);
export const getStrainsSchema = createSelectSchema(strains, {
  id: z.coerce.number(),
  currentPricePerGram: z.coerce.number(),
});

export const getBatchDetailSchema = updateBatchInputSchema.pick({ id: true });
export const getStrainDetailSchema = updateStrainInputSchema.pick({ id: true });
export const getBatchesByStrainIdSchema = createBatchInputSchema.pick({
  strainId: true,
});

export type BatchProps = z.infer<typeof getBatchesSchema>;
export type CreateBatchInput = z.infer<typeof createBatchInputSchema>;
export type UpdateBatchInput = z.infer<typeof updateBatchInputSchema>;

export type PlantProps = z.infer<typeof getPlantsSchema>;
export type CreatePlantInput = z.infer<typeof createPlantInputSchema>;
export type UpdatePlantInput = z.infer<typeof updatePlantInputSchema>;
export type DeletePlantInput = z.infer<typeof deletePlantInputSchema>;

export type StrainProps = z.infer<typeof getStrainsSchema>;
export type CreateStrainInput = z.infer<typeof createStrainInputSchema>;
export type UpdateStrainInput = z.infer<typeof updateStrainInputSchema>;
export type DeleteStrainInput = z.infer<typeof deleteStrainInputSchema>;
