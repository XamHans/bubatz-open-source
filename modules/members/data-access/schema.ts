import { sql } from 'drizzle-orm';
import { boolean, date, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const members = pgTable('profiles', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  // general info
  firstName: text('first_name'),
  lastName: text('last_name'),
  birthDay: date('birthday'),
  // contact
  email: text('email'),
  phone: text('phone'),
  // address
  street: text('street'),
  city: text('city'),
  zip: text('zip'),
  //club info
  status: text('member_status'),
  isAdmin: boolean('is_admin'),
});

// Schema for inserting a user - can be used to validate API requests
export const addMemberInputSchema = createInsertSchema(members, {
  email: (schema) => schema.email.email(),
  phone: (schema) => schema.phone.optional(),
  status: (schema) => schema.status.default('PENDING'),
  isAdmin: (schema) => schema.isAdmin.default(false),
  id: (schema) => schema.id.optional(),
});
export type AddMemberInput = z.infer<typeof addMemberInputSchema>;

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
