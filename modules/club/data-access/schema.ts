import { sql } from 'drizzle-orm';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const members = pgTable('club', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  // general info
  name: text('name'),

  // contact
  email: text('email'),
  phone: text('phone'),
  // address
  street: text('street'),
  city: text('city'),
  zip: text('zip'),
});

// Schema for inserting a club
export const addClubInputSchema = createInsertSchema(members, {
  email: (schema) => schema.email.email(),
  phone: (schema) => schema.phone.optional(),
  id: (schema) => schema.id.optional(),
});
export type AddClubInput = z.infer<typeof addClubInputSchema>;

// Schema for selecting a user - can be used to validate API responses
// const selectUserSchema = createSelectSchema(members);

// Overriding the fields
// const insertUserSchema = createInsertSchema(members, {
//   role: z.string(),
// });

// Refining the fields - useful if you want to change the fields before they become nullable/optional in the final schema
// const insertUserSchema = createInsertSchema(users, {
//   id: (schema) => schema.id.positive(),
//   email: (schema) => schema.email.email(),
//   role: z.string(),
// });
