--> ALTER TABLE "sales_items" DROP CONSTRAINT "sales_items_plant_id_plants_id_fk";
--> statement-breakpoint
ALTER TABLE "sales_items" DROP COLUMN IF EXISTS "quantity";--> statement-breakpoint
ALTER TABLE "sales_items" DROP COLUMN IF EXISTS "plant_id";