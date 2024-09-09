import { z } from 'zod'

// ... (keep the existing table definitions)

// Updated CRUD schemas

// Batch schemas
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

export const updateBatchInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  startDate: z.coerce
    .date()
    .transform((date) => date.toISOString())
    .optional(),
  endDate: z.coerce
    .date()
    .transform((date) => date.toISOString())
    .optional(),
  currentGrowthStage: z.string().min(1).optional(),
  strainId: z.number().int().optional(),
  expectedYield: z.number().int().optional(),
  totalYield: z.number().int().optional(),
  totalDestroyed: z.number().int().optional(),
  isArchived: z.boolean().optional(),
})

export const deleteBatchInputSchema = z.object({
  id: z.string().uuid(),
})

export const getBatchOutputSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  strainId: z.number().int().nullable(),
  startDate: z.date(),
  endDate: z.date().nullable(),
  currentGrowthStage: z.string(),
  totalYield: z.number().nullable(),
  expectedYield: z.number().nullable(),
  totalDestroyed: z.number().nullable(),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Plant schemas
export const createPlantInputSchema = z.object({
  name: z.string().default(''),
  batchId: z.string().uuid(),
  position: z.string().min(1),
  health: z.string().default('HEALTHY'),
})

export const updatePlantInputSchema = z.object({
  id: z.number().positive(),
  name: z.string().optional(),
  batchId: z.string().uuid().optional(),
  position: z.string().min(1).optional(),
  health: z.string().optional(),
  yield: z.number().optional(),
})

export const deletePlantInputSchema = z.object({
  id: z.number().positive(),
})

export const getPlantOutputSchema = z.object({
  id: z.number(),
  name: z.string(),
  batchId: z.string().uuid(),
  position: z.string(),
  health: z.string(),
  yield: z.number().nullable(),
})

// Strain schemas
export const createStrainInputSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  thc: z.number().min(0),
  cbd: z.number().min(0),
  currentPricePerGram: z.number().min(0),
  amountAvailable: z.number().min(0).optional(),
})

export const updateStrainInputSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  thc: z.number().min(0).optional(),
  cbd: z.number().min(0).optional(),
  currentPricePerGram: z.number().min(0).optional(),
  amountAvailable: z.number().min(0).optional(),
  isArchived: z.boolean().optional(),
})

export const deleteStrainInputSchema = z.object({
  id: z.number().positive(),
})

export const getStrainOutputSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  thc: z.number(),
  cbd: z.number(),
  isArchived: z.boolean(),
  currentPricePerGram: z.number(),
  amountAvailable: z.number().nullable(),
})

// Type definitions
export type CreateBatchInput = z.infer<typeof createBatchInputSchema>
export type UpdateBatchInput = z.infer<typeof updateBatchInputSchema>
export type DeleteBatchInput = z.infer<typeof deleteBatchInputSchema>
export type BatchProps = z.infer<typeof getBatchOutputSchema>

export type CreatePlantInput = z.infer<typeof createPlantInputSchema>
export type UpdatePlantInput = z.infer<typeof updatePlantInputSchema>
export type DeletePlantInput = z.infer<typeof deletePlantInputSchema>
export type PlantProps = z.infer<typeof getPlantOutputSchema>

export type CreateStrainInput = z.infer<typeof createStrainInputSchema>
export type UpdateStrainInput = z.infer<typeof updateStrainInputSchema>
export type DeleteStrainInput = z.infer<typeof deleteStrainInputSchema>
export type StrainProps = z.infer<typeof getStrainOutputSchema>
