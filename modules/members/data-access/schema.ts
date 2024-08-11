import { UUID } from 'crypto';
import { relations } from 'drizzle-orm';
import {
  date,
  pgEnum,
  pgSchema,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const protectedSchema = pgSchema('protected');

export const memberRoleEnum = pgEnum('member_role', ['MEMBER', 'ADMIN']);

export const members = protectedSchema.table('members', {
  id: uuid('id').primaryKey().defaultRandom(),

  // general info
  firstName: text('first_name'),
  lastName: text('last_name'),
  fullName: text('full_name'),
  birthday: date('birthday'),

  // contact
  email: text('email').unique(),
  phone: text('phone'),
  // address
  street: text('street'),
  city: text('city'),
  zip: text('zip'),
  //club info
  status: text('status').default('PENDING'),
  // isAdmin: boolean('is_admin').default(false),
  role: memberRoleEnum('role').default('MEMBER'),
  // auth stuff
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  emailVerificationToken: text('emailVerificationToken').unique(),
  passwordHash: text('passwordHash'),
  resetPasswordToken: text('resetPasswordToken').unique(),
  resetPasswordTokenExpiry: timestamp('resetPasswordTokenExpiry', {
    mode: 'date',
  }),
  image: text('image'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
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
