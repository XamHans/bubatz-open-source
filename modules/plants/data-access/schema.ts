import { protectedSchema } from '@/modules/members/data-access/schema'
import { sql } from 'drizzle-orm'
import {
  boolean,
  date,
  integer,
  numeric,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { z } from 'zod'

export const postgresDateSchema = z.string().refine(
  (date) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) return false

    const [year, month, day] = date.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    return (
      dateObj.getFullYear() === year &&
      dateObj.getMonth() === month - 1 &&
      dateObj.getDate() === day
    )
  },
  {
    message: 'Invalid date format. Expected YYYY-MM-DD',
  },
)

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
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const plants = protectedSchema.table('plants', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  batchId: uuid('batch_id')
    .notNull()
    .references(() => batches.id, { onDelete: 'cascade' }),
  position: text('position').notNull(),
  health: text('health').default('HEALTHY'),
  yield: numeric('yield').default('0'),
})

export const strains = protectedSchema.table('strains', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  thc: numeric('thc').notNull(),
  cbd: numeric('cbd').notNull(),
  isArchived: boolean('is_archived').default(false),
  currentPricePerGram: numeric('current_price_per_gram').notNull(),
  amountAvailable: numeric('amount_available').default('0'),
})

export const strainsRelation = relations(batches, ({ one }) => ({
  strain: one(strains, {
    fields: [batches.strainId],
    references: [strains.id],
  }),
}))

export const batchesRelations = relations(batches, ({ many }) => ({
  plants: many(plants),
}))

// CRUD Schemas

// Batches
export const createBatchInputSchema = z.object({
  name: z.string().min(1),
  startDate: z.coerce.date().transform((date) => date.toISOString()),
  endDate: z.coerce
    .date()
    .transform((date) => date.toISOString())
    .optional(),
  currentGrowthStage: z.string().min(1),
  strainId: z.number().int(),
})

export const fetchBatchesInputSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  strainId: z.number().int().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  currentGrowthStage: z.string().optional(),
  isArchived: z.boolean().optional(),
})

export const updateBatchInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  strainId: z.number().int().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  currentGrowthStage: z.string().optional(),
  totalYield: z.coerce.number().optional(),
  expectedYield: z.coerce.number().optional(),
  totalDestroyed: z.coerce.number().optional(),
  isArchived: z.boolean().optional(),
})

// Plants
export const createPlantInputSchema = z.object({
  name: z.string().optional().default(''),
  batchId: z.string().uuid(),
  position: z.string().min(1),
  health: z.string().optional().default('HEALTHY'),
})

export const updatePlantInputSchema = z.object({
  id: z.number().positive(),
  name: z.string().optional(),
  batchId: z.string().uuid().optional(),
  position: z.string().optional(),
  health: z.string().optional(),
  yield: z.number().optional(),
})

export const deletePlantInputSchema = z.object({
  id: z.number().positive(),
})

// Strains
export const createStrainInputSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3),
  cbd: z.number().min(0),
  thc: z.number().min(0),
  description: z.string().optional(),
  currentPricePerGram: z.number().min(0).default(0),
  amountAvailable: z.number().min(0).default(0).optional(),
})

export const updateStrainInputSchema = z.object({
  id: z.number().positive(),
  name: z.string().optional(),
  description: z.string().optional(),
  thc: z.string().optional(),
  cbd: z.string().optional(),
  isArchived: z.boolean().optional(),
  currentPricePerGram: z.string().optional(),
  amountAvailable: z.string().optional(),
})

export const deleteStrainInputSchema = z.object({
  id: z.number().positive(),
})

// Get schemas
export const getBatchesSchema = z.array(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    strainId: z.number().int().nullable(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable(),
    currentGrowthStage: z.string(),
    totalYield: z.number().nullable(),
    expectedYield: z.number().nullable(),
    totalDestroyed: z.number().nullable(),
    isArchived: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
)

export const getPlantsSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    batchId: z.string().uuid(),
    position: z.string(),
    health: z.string(),
    yield: z.number().nullable(),
  }),
)

export const getStrainsSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    thc: z.number(),
    cbd: z.number(),
    isArchived: z.boolean(),
    currentPricePerGram: z.number(),
    amountAvailable: z.number().nullable(),
  }),
)

export const getBatchDetailSchema = z.object({
  id: z.string().uuid(),
})

export const getStrainDetailSchema = z.object({
  id: z.number().positive(),
})

export const getBatchesByStrainIdSchema = z.object({
  strainId: z.number().int(),
})

// Types
export type BatchProps = z.infer<typeof getBatchesSchema>[number]
export type CreateBatchInput = z.infer<typeof createBatchInputSchema>
export type UpdateBatchInput = z.infer<typeof updateBatchInputSchema>

export type PlantProps = z.infer<typeof getPlantsSchema>[number]
export type CreatePlantInput = z.infer<typeof createPlantInputSchema>
export type UpdatePlantInput = z.infer<typeof updatePlantInputSchema>
export type DeletePlantInput = z.infer<typeof deletePlantInputSchema>

export type StrainProps = z.infer<typeof getStrainsSchema>[number]
export type CreateStrainInput = z.infer<typeof createStrainInputSchema>
export type UpdateStrainInput = z.infer<typeof updateStrainInputSchema>
export type DeleteStrainInput = z.infer<typeof deleteStrainInputSchema>
