import { relations, sql } from 'drizzle-orm';
import {
  date,
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  boolean,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN']);

export const members = pgTable('members', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  // general info
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  username: text('username').unique(),
  birthday: date('birthday')
    .notNull()
    .default(sql`now()`),
  // contact
  email: text('email').unique().notNull(),
  phone: text('phone').notNull(),
  // address
  street: text('street').notNull(),
  city: text('city').notNull(),
  zip: text('zip').notNull(),
  //club info
  status: text('member_status').notNull().default('PENDING'),
  // isAdmin: boolean('is_admin').notNull().default(false),
  role: userRoleEnum('role').notNull().default('USER'),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  emailVerificationToken: text('emailVerificationToken').unique(),
  passwordHash: text('passwordHash'),
  resetPasswordToken: text('resetPasswordToken').unique(),
  resetPasswordTokenExpiry: timestamp('resetPasswordTokenExpiry', {
    mode: 'date',
  }),
  image: text('image'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
});

/**
 * * Relations
 */

export const membersRelations = relations(members, ({ many }) => ({
  buyer: many(members),
}));

// Schema for inserting a user - can be used to validate API requests
export const addMemberInputSchema = createInsertSchema(members, {
  email: (schema) => schema.email.email().default(''),
  phone: (schema) => schema.phone.optional(),
  status: (schema) => schema.status.default('PENDING'),
  role: (schema) => schema.role.default('USER'),
  id: (schema) => schema.id.optional(),
});
export type AddMemberInput = z.infer<typeof addMemberInputSchema>;

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(members);
export type UserSchema = z.infer<typeof selectUserSchema>;

// Schema for updating a user
export const updateMemberInputSchema = createInsertSchema(members, {
  role: (schema) => schema.role,
  id: (schema) => schema.id,

  firstName: (schema) => schema.firstName,
  lastName: (schema) => schema.lastName,
  email: (schema) => schema.email,
  phone: (schema) => schema.phone,
  status: (schema) => schema.status,
  street: (schema) => schema.street,
  city: (schema) => schema.city,
  zip: (schema) => schema.zip,
  birthday: (schema) => schema.birthday,
});
export type UpdateMemberInput = z.infer<typeof updateMemberInputSchema>;

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
