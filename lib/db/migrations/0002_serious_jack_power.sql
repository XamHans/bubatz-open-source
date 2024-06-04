DO $$ BEGIN
 CREATE TYPE "public"."paymentMethods" AS ENUM('CASH', 'CARD', 'WALLET');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plants" (
	"id" serial PRIMARY KEY NOT NULL,
	"quantity" text NOT NULL,
	"price_per_gram" real NOT NULL,
	"strain" text NOT NULL,
	"batch_id" text NOT NULL,
	"current_growth_stage" text NOT NULL,
	"seed_to_sale" jsonb DEFAULT '{"seed":{"date_planted":null,"source":null,"seed_lot":null},"germination":{"date_germinated":null,"conditions":{"temperature":null,"humidity":null,"light_hours":null}},"vegetative":{"start_date":null,"end_date":null,"conditions":{"temperature":null,"humidity":null,"light_hours":null},"nutrients":{"type":null,"schedule":null,"ph_level":null}},"flowering":{"start_date":null,"estimated_end_date":null,"conditions":{"temperature":null,"humidity":null,"light_hours":null},"nutrients":{"type":null,"schedule":null,"ph_level":null}},"harvest":{"estimated_date":null,"actual_date":null,"yield_estimate_grams":null,"yield_actual_grams":null,"drying_conditions":{"temperature":null,"humidity":null}},"processing":{"drying_start_date":null,"drying_end_date":null,"curing_start_date":null,"curing_end_date":null,"trim_date":null,"packaging_date":null,"final_weight_grams":null},"destroyed":{"weight_grams_destroyed":null,"destroyed_date":null,"reason":null}}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text,
	"last_name" text,
	"birthday" date,
	"email" text,
	"phone" text,
	"street" text,
	"city" text,
	"zip" text,
	"member_status" text,
	"is_admin" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sales" (
	"id" serial PRIMARY KEY NOT NULL,
	"total_price" real NOT NULL,
	"paid_via" "paymentMethods" NOT NULL,
	"user_id" uuid NOT NULL,
	"sales_by_id" uuid NOT NULL,
	"created_at" time DEFAULT now() NOT NULL,
	"updated_at" time with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"quantity" real NOT NULL,
	"weight_grams" real NOT NULL,
	"price" real NOT NULL,
	"plant_id" integer NOT NULL,
	"sale_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales" ADD CONSTRAINT "sales_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales" ADD CONSTRAINT "sales_sales_by_id_profiles_id_fk" FOREIGN KEY ("sales_by_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
