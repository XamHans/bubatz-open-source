import { z } from 'zod';

// Zod schemas
const conditionsSchema = z.object({
  temperature: z.string(),
  humidity: z.string(),
  light_hours: z.number(),
});

const nutrientsSchema = z.object({
  type: z.string(),
  schedule: z.string(),
  ph_level: z.number(),
});

const dryingConditionsSchema = z.object({
  temperature: z.string(),
  humidity: z.string(),
});

const yieldSchema = z.object({
  yield_estimate_grams: z.number().optional(),
  yield_actual_grams: z.number().nullable().optional(),
});

const phaseSchema = z.object({
  date_germinated: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  estimated_end_date: z.string().optional(),
  actual_date: z.string().nullable().optional(),
  conditions: conditionsSchema.optional(),
  nutrients: nutrientsSchema.optional(),
});

const processingSchema = z.object({
  drying_start_date: z.string().nullable().optional(),
  drying_end_date: z.string().nullable().optional(),
  curing_start_date: z.string().nullable().optional(),
  curing_end_date: z.string().nullable().optional(),
  trim_date: z.string().nullable().optional(),
  packaging_date: z.string().nullable().optional(),
  final_weight_grams: z.number().nullable().optional(),
});

const destroyedSchema = z.object({
  weight_grams_destroyed: z.boolean(),
  destroyed_date: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
});

const growPhasesSchema = z.object({
  germination: phaseSchema,
  vegetative: phaseSchema,
  flowering: phaseSchema,
  harvest: phaseSchema.merge(yieldSchema), // Merging yieldSchema with phaseSchema
  processing: processingSchema.merge(dryingConditionsSchema), // Merging dryingConditionsSchema with processingSchema
  destroyed: destroyedSchema,
});

// Inferred TypeScript type
type GrowPhases = z.infer<typeof growPhasesSchema>;

export {
  conditionsSchema,
  destroyedSchema,
  dryingConditionsSchema,
  growPhasesSchema,
  nutrientsSchema,
  phaseSchema,
  processingSchema,
  yieldSchema,
};
export type { GrowPhases };
