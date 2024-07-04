import { UUID } from 'crypto';
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
  status: text('status').notNull().default('PENDING'),
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
  id: (schema) => schema.id.uuid(),
  firstName: (schema) => schema.firstName.min(3),
  lastName: (schema) => schema.lastName.min(3),
  email: (schema) => schema.email.email(),
  phone: (schema) => schema.phone.min(9),
  street: (schema) => schema.street.min(5),
  city: (schema) => schema.city.min(3),
  zip: (schema) => schema.zip.min(7),
  birthday: (schema) => schema.birthday,
  status: (schema) => schema.status.default('PENDING'),
  role: (schema) => schema.role.default('USER'),
});
export type AddMemberInput = z.infer<typeof addMemberInputSchema>;

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(members);
export const selectMultipleUsersSchema = z.array(selectUserSchema);
export type UserSchema = z.infer<typeof selectUserSchema>;

// Schema for updating a user
export const updateMemberInputSchema = createInsertSchema(members, {
  // role: (schema) => schema.role,
  // id: (schema) => schema.id,
  firstName: (schema) => schema.firstName.optional(),
  lastName: (schema) => schema.lastName.optional(),
  email: (schema) => schema.email.optional(),
  phone: (schema) => schema.phone.optional(),
  status: (schema) => schema.status.optional(),
  street: (schema) => schema.street.optional(),
  city: (schema) => schema.city.optional(),
  zip: (schema) => schema.zip.optional(),
  // birthday: (schema) => schema.birthday,
});
export type UpdateMemberInput = z.infer<typeof updateMemberInputSchema>;

// Schema for deleting a user
export const deleteMemberInputSchema = z.object({
  id: z.string(),
});

export type deleteMemberInput = { id: UUID };

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
