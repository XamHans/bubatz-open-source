ALTER TABLE "members" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "role" "user_role" DEFAULT 'USER' NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "emailVerified" timestamp;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "emailVerificationToken" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "passwordHash" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "resetPasswordToken" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "resetPasswordTokenExpiry" timestamp;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN IF EXISTS "is_admin";