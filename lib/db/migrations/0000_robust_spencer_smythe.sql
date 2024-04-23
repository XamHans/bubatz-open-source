CREATE TABLE IF NOT EXISTS "members" (
	"id" uuid PRIMARY KEY NOT NULL,
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
