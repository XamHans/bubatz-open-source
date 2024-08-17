ALTER TABLE "protected"."plants" ALTER COLUMN "health" SET DEFAULT 'HEALTHY';--> statement-breakpoint
ALTER TABLE "protected"."batches" DROP COLUMN IF EXISTS "price_per_gram";--> statement-breakpoint
ALTER TABLE "protected"."plants" DROP COLUMN IF EXISTS "seed_to_sale";