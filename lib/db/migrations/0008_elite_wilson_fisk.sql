ALTER TABLE "sales_items" ADD COLUMN "plant_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sales_items" ADD CONSTRAINT "sales_items_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
