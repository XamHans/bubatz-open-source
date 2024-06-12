DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('USER', 'ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."paymentMethods" AS ENUM('CASH', 'CARD', 'WALLET');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"role" "user_role" DEFAULT 'USER' NOT NULL,
	"name" text,
	"surname" text,
	"username" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"emailVerificationToken" text,
	"passwordHash" text,
	"resetPasswordToken" text,
	"resetPasswordTokenExpiry" timestamp,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_emailVerificationToken_unique" UNIQUE("emailVerificationToken"),
	CONSTRAINT "user_resetPasswordToken_unique" UNIQUE("resetPasswordToken")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"current_growth_stage" text NOT NULL,
	"price_per_gram" real,
	"other_details" jsonb DEFAULT '{}'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plants" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"batch_id" uuid NOT NULL,
	"position" text NOT NULL,
	"health" text DEFAULT 'healthy',
	"seed_to_sale" jsonb DEFAULT '{"seed":{"date_planted":null,"source":null,"seed_lot":null},"germination":{"date_germinated":null,"conditions":{"temperature":null,"humidity":null,"light_hours":null}},"vegetative":{"start_date":null,"end_date":null,"conditions":{"temperature":null,"humidity":null,"light_hours":null},"nutrients":{"type":null,"schedule":null,"ph_level":null}},"flowering":{"start_date":null,"estimated_end_date":null,"conditions":{"temperature":null,"humidity":null,"light_hours":null},"nutrients":{"type":null,"schedule":null,"ph_level":null}},"harvest":{"estimated_date":null,"actual_date":null,"yield_estimate_grams":null,"yield_actual_grams":null,"drying_conditions":{"temperature":null,"humidity":null}},"processing":{"drying_start_date":null,"drying_end_date":null,"curing_start_date":null,"curing_end_date":null,"trim_date":null,"packaging_date":null,"final_weight_grams":null},"destroyed":{"weight_grams_destroyed":null,"destroyed_date":null,"reason":null}}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"username" text,
	"birthday" date DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"street" text NOT NULL,
	"city" text NOT NULL,
	"zip" text NOT NULL,
	"member_status" text DEFAULT 'PENDING' NOT NULL,
	"role" "user_role" DEFAULT 'USER' NOT NULL,
	"emailVerified" timestamp,
	"emailVerificationToken" text,
	"passwordHash" text,
	"resetPasswordToken" text,
	"resetPasswordTokenExpiry" timestamp,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "members_username_unique" UNIQUE("username"),
	CONSTRAINT "members_email_unique" UNIQUE("email"),
	CONSTRAINT "members_emailVerificationToken_unique" UNIQUE("emailVerificationToken"),
	CONSTRAINT "members_resetPasswordToken_unique" UNIQUE("resetPasswordToken")
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
 ALTER TABLE "plants" ADD CONSTRAINT "plants_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales" ADD CONSTRAINT "sales_user_id_members_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales" ADD CONSTRAINT "sales_sales_by_id_members_id_fk" FOREIGN KEY ("sales_by_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
