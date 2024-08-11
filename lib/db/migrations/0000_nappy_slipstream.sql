CREATE SCHEMA "next_auth";
--> statement-breakpoint
CREATE SCHEMA "protected";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."member_role" AS ENUM('MEMBER', 'ADMIN');
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
CREATE TABLE IF NOT EXISTS "next_auth"."account" (
	"memberId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "next_auth"."authenticator" (
	"credentialID" text NOT NULL,
	"memberId" uuid NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_memberId_credentialID_pk" PRIMARY KEY("memberId","credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "next_auth"."session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"memberId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "next_auth"."verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "protected"."members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text,
	"last_name" text,
	"full_name" text,
	"birthday" date,
	"email" text,
	"phone" text,
	"street" text,
	"city" text,
	"zip" text,
	"status" text DEFAULT 'PENDING',
	"role" "member_role" DEFAULT 'MEMBER',
	"emailVerified" timestamp,
	"emailVerificationToken" text,
	"passwordHash" text,
	"resetPasswordToken" text,
	"resetPasswordTokenExpiry" timestamp,
	"image" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "members_email_unique" UNIQUE("email"),
	CONSTRAINT "members_emailVerificationToken_unique" UNIQUE("emailVerificationToken"),
	CONSTRAINT "members_resetPasswordToken_unique" UNIQUE("resetPasswordToken")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "protected"."batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"strain_id" integer,
	"start_date" date DEFAULT now() NOT NULL,
	"end_date" date NOT NULL,
	"current_growth_stage" text NOT NULL,
	"price_per_gram" real,
	"other_details" jsonb DEFAULT '{}'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "protected"."plants" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"batch_id" uuid NOT NULL,
	"position" text NOT NULL,
	"health" text DEFAULT 'healthy',
	"yield" numeric DEFAULT '0',
	"seed_to_sale" jsonb DEFAULT '{"seed":{"date_planted":null,"source":null,"seed_lot":null},"germination":{"date_germinated":null,"conditions":{"temperature":null,"humidity":null,"light_hours":null}},"vegetative":{"start_date":null,"end_date":null,"conditions":{"temperature":null,"humidity":null,"light_hours":null},"nutrients":{"type":null,"schedule":null,"ph_level":null}},"flowering":{"start_date":null,"estimated_end_date":null,"conditions":{"temperature":null,"humidity":null,"light_hours":null},"nutrients":{"type":null,"schedule":null,"ph_level":null}},"harvest":{"estimated_date":null,"drying_conditions":{"temperature":null,"humidity":null}}}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "protected"."strains" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"thc" numeric NOT NULL,
	"cbd" numeric NOT NULL,
	"current_price_per_gram" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "protected"."sales" (
	"id" serial PRIMARY KEY NOT NULL,
	"total_price" real NOT NULL,
	"paid_via" "paymentMethods" NOT NULL,
	"member_id" uuid NOT NULL,
	"sales_by_id" uuid NOT NULL,
	"created_at" time DEFAULT now() NOT NULL,
	"updated_at" time with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "protected"."sales_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"weight_grams" real NOT NULL,
	"price" real NOT NULL,
	"strain_id" integer NOT NULL,
	"sale_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "next_auth"."account" ADD CONSTRAINT "account_memberId_members_id_fk" FOREIGN KEY ("memberId") REFERENCES "protected"."members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "next_auth"."authenticator" ADD CONSTRAINT "authenticator_memberId_members_id_fk" FOREIGN KEY ("memberId") REFERENCES "protected"."members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "next_auth"."session" ADD CONSTRAINT "session_memberId_members_id_fk" FOREIGN KEY ("memberId") REFERENCES "protected"."members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "protected"."batches" ADD CONSTRAINT "batches_strain_id_strains_id_fk" FOREIGN KEY ("strain_id") REFERENCES "protected"."strains"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "protected"."plants" ADD CONSTRAINT "plants_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "protected"."batches"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "protected"."sales" ADD CONSTRAINT "sales_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "protected"."members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "protected"."sales" ADD CONSTRAINT "sales_sales_by_id_members_id_fk" FOREIGN KEY ("sales_by_id") REFERENCES "protected"."members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "protected"."sales_items" ADD CONSTRAINT "sales_items_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "protected"."sales"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
