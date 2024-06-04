import { relations, sql } from 'drizzle-orm';
import { boolean, date, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const members = pgTable('profiles', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  // general info
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  birthday: date('birthday')
    .notNull()
    .default(sql`now()`),
  // contact
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  // address
  street: text('street').notNull(),
  city: text('city').notNull(),
  zip: text('zip').notNull(),
  //club info
  status: text('member_status').notNull().default('PENDING'),
  isAdmin: boolean('is_admin').notNull().default(false),
});

// Schema for inserting a user - can be used to validate API requests
export const addMemberInputSchema = createInsertSchema(members, {
  email: (schema) => schema.email.email().default(''),
  phone: (schema) => schema.phone.optional(),
  status: (schema) => schema.status.default('PENDING'),
  isAdmin: (schema) => schema.isAdmin.default(false),
  id: (schema) => schema.id.optional(),
});
export type AddMemberInput = z.infer<typeof addMemberInputSchema>;

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(members);
export type UserSchema = z.infer<typeof selectUserSchema>;

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
