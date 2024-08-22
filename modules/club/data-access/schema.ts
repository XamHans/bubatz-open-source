import {
  boolean,
  pgEnum,
  pgSchema,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const protectedSchema = pgSchema('protected');

export const clubStatusEnum = pgEnum('club_status', ['ACTIVE', 'INACTIVE']);

export const clubs = protectedSchema.table('clubs', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  // location
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zip: text('zip'),
  country: text('country'),
  // contact
  phone: text('phone'),
  email: text('email'),
  lookingForMembers: boolean('looking_for_members').default(true),
  status: clubStatusEnum('status').default('ACTIVE'),
  owner: uuid('owner').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});

// Schema for inserting a club
export const addClubInputSchema = createInsertSchema(clubs, {
  name: (schema) => schema.name.min(3),
  description: (schema) => schema.description.optional(),
  address: (schema) => schema.address.optional(),
  city: (schema) => schema.city.optional(),
  state: (schema) => schema.state.optional(),
  zip: (schema) => schema.zip.optional(),
  country: (schema) => schema.country.optional(),
  phone: (schema) => schema.phone.optional(),
  email: (schema) => schema.email.email().optional(),
  lookingForMembers: (schema) => schema.lookingForMembers.optional(),
  status: (schema) => schema.status.optional(),
  owner: (schema) => schema.owner.uuid(),
});
export type AddClubInput = z.infer<typeof addClubInputSchema>;

// Schema for selecting a club
export const selectClubSchema = createSelectSchema(clubs);
export const selectMultipleClubsSchema = z.array(selectClubSchema);
export type ClubSchema = z.infer<typeof selectClubSchema>;

// Schema for updating a club
export const updateClubInputSchema = createInsertSchema(clubs, {
  id: (schema) => schema.id.string(),
  name: (schema) => schema.name.optional(),
  description: (schema) => schema.description.optional(),
  address: (schema) => schema.address.optional(),
  city: (schema) => schema.city.optional(),
  state: (schema) => schema.state.optional(),
  zip: (schema) => schema.zip.optional(),
  country: (schema) => schema.country.optional(),
  phone: (schema) => schema.phone.optional(),
  email: (schema) => schema.email.email().optional(),
  lookingForMembers: (schema) => schema.lookingForMembers.optional(),
  status: (schema) => schema.status.optional(),
});
export type UpdateClubInput = z.infer<typeof updateClubInputSchema>;

// Schema for deleting a club
export const deleteClubInputSchema = z.object({
  id: z.string().uuid(),
});
export type DeleteClubInput = z.infer<typeof deleteClubInputSchema>;
