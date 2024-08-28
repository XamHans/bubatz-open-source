import { z } from 'zod'

// Zod schemas
const conditionsSchema = z.object({
  temperature: z.string().optional(),
  humidity: z.string().optional(),
  light_hours: z.number().optional(),
})

const nutrientsSchema = z.object({
  type: z.string().optional(),
  schedule: z.string().optional(),
  ph_level: z.number().optional(),
})

const dryingConditionsSchema = z.object({
  temperature: z.string().optional(),
  humidity: z.string().optional(),
})

const yieldSchema = z.object({
  yield_estimate_grams: z.number().optional(),
  yield_actual_grams: z.number().nullable().optional(),
})

const phaseSchema = z.object({
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  estimated_end_date: z.coerce.date().optional(),
  conditions: conditionsSchema.optional(),
  nutrients: nutrientsSchema.optional(),
})

const processingSchema = z.object({
  drying_start_date: z.coerce.date().nullable().optional(),
  drying_end_date: z.coerce.date().nullable().optional(),
  curing_start_date: z.coerce.date().nullable().optional(),
  curing_end_date: z.coerce.date().nullable().optional(),
  trim_date: z.coerce.date().nullable().optional(),
  packaging_date: z.coerce.date().nullable().optional(),
  final_weight_grams: z.number().nullable().optional(),
})

const destroyedSchema = z.object({
  weight_grams_destroyed: z.boolean(),
  destroyed_date: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
})

const germinationSchema = z.object({
  date_germinated: z.string().optional(),
  seed_type: z.string().optional(),
  medium: z.string().optional(),
})

const harvestSchema = phaseSchema.merge(yieldSchema)

const growPhasesSchema = z.object({
  germination: phaseSchema.merge(germinationSchema),
  vegetative: phaseSchema,
  flowering: phaseSchema,
  harvest: harvestSchema,
  processing: processingSchema.merge(dryingConditionsSchema), // Merging dryingConditionsSchema with processingSchema
  destroyed: destroyedSchema,
})

// Inferred TypeScript type
type GrowPhases = z.infer<typeof growPhasesSchema>

export {
  conditionsSchema,
  destroyedSchema,
  dryingConditionsSchema,
  growPhasesSchema,
  harvestSchema,
  nutrientsSchema,
  phaseSchema,
  processingSchema,
  yieldSchema,
}
export type { GrowPhases }
