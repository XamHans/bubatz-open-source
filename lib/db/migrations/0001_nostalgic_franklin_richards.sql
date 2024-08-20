ALTER TABLE "protected"."batches" ADD COLUMN "expected_yield" numeric DEFAULT '0';--> statement-breakpoint
ALTER TABLE "protected"."batches" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "protected"."batches" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "protected"."strains" ADD COLUMN "is_archived" boolean DEFAULT false;