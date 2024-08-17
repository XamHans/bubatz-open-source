ALTER TABLE "protected"."batches" ALTER COLUMN "current_growth_stage" SET DEFAULT 'SEEDING';--> statement-breakpoint
ALTER TABLE "protected"."batches" ADD COLUMN "total_yield" numeric DEFAULT '0';--> statement-breakpoint
ALTER TABLE "protected"."batches" ADD COLUMN "total_destroyed" numeric DEFAULT '0';--> statement-breakpoint
ALTER TABLE "protected"."batches" ADD COLUMN "is_archived" boolean DEFAULT false;