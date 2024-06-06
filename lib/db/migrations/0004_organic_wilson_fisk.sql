ALTER TABLE "profiles" RENAME TO "members";--> statement-breakpoint
-- ALTER TABLE "sales" DROP CONSTRAINT "sales_user_id_profiles_id_fk";
--> statement-breakpoint
-- ALTER TABLE "sales" DROP CONSTRAINT "sales_sales_by_id_profiles_id_fk";
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
