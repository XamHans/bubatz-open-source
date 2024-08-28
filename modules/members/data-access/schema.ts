import { UUID } from 'crypto';
import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  decimal,
  pgEnum,
  pgSchema,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const protectedSchema = pgSchema('protected');

export const memberRoleEnum = pgEnum('member_role', ['MEMBER', 'ADMIN']);
// Enum for payment status
export const paymentStatusEnum = pgEnum('payment_status', [
  'PAID',
  'PENDING',
  'OVERDUE',
]);

export const members = protectedSchema.table('members', {
  id: uuid('id').primaryKey().defaultRandom(),

  // general info
  firstName: text('first_name'),
  lastName: text('last_name'),
  fullName: text('full_name'),
  birthday: date('birthday'),
  image: text('image'),

  // contact
  email: text('email').unique(),
  phone: text('phone'),
  // address
  street: text('street'),
  city: text('city'),
  zip: text('zip'),
  //club info
  status: text('status').default('PENDING'),
  role: memberRoleEnum('role').default('MEMBER'),
  currentYearPaid: boolean('current_year_paid').default(false),
  lastPaymentDate: date('last_payment_date'),
  // auth stuff
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  emailVerificationToken: text('emailVerificationToken').unique(),
  passwordHash: text('passwordHash'),
  resetPasswordToken: text('resetPasswordToken').unique(),
  resetPasswordTokenExpiry: timestamp('resetPasswordTokenExpiry', {
    mode: 'date',
  }),

  // timestamps
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
  firstName: (schema) => schema.firstName.min(2),
  lastName: (schema) => schema.lastName.min(2),
  email: (schema) => schema.email.email(),
  phone: (schema) => schema.phone.min(9),
  street: (schema) => schema.street.min(1),
  city: (schema) => schema.city.min(1),
  zip: (schema) => schema.zip.min(4),
  birthday: () => z.string().min(1).regex(/^\d{2}\.\d{2}\.\d{4}$/, "Birthday must be in DD.MM.YYYY format"),
  status: (schema) => schema.status.default('PENDING'),
  role: (schema) => schema.role.default('MEMBER'),
});
export type AddMemberInput = z.infer<typeof addMemberInputSchema>;

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(members);
export const selectMultipleUsersSchema = z.array(selectUserSchema);
export type UserSchema = z.infer<typeof selectUserSchema>;

// Schema for updating a user
export const updateMemberInputSchema = createInsertSchema(members).partial()
  .extend({
    id: z.string().uuid(),
    birthday: z.string().transform((date) => new Date(date).toISOString()),
  });;
export type UpdateMemberInput = z.infer<typeof updateMemberInputSchema>;

// Schema for deleting a user
export const deleteMemberInputSchema = z.object({
  id: z.string(),
});

export type deleteMemberInput = { id: UUID };


export const getMemberSchemaInput = createSelectSchema(members);
export type MemberProps = z.infer<typeof getMemberSchemaInput>;

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Membership payments table
export const membershipPayments = protectedSchema.table('membership_payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id')
    .references(() => members.id)
    .notNull(),
  year: text('year').notNull(), // Store as text for flexibility, e.g., "2023-2024"
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentDate: date('payment_date'),
  paymentStatus: paymentStatusEnum('payment_status').default('PENDING'),
  paymentMethod: text('payment_method'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});

// Relation between members and membership payments
export const membershipPaymentsRelations = relations(
  membershipPayments,
  ({ one }) => ({
    member: one(members, {
      fields: [membershipPayments.memberId],
      references: [members.id],
    }),
  }),
);

export const createMemberPaymentInputSchema = createInsertSchema(
  membershipPayments,
  {
    memberId: (schema) => schema.memberId.uuid(),
    year: (schema) => schema.year.min(4).max(9), // Allows for academic years like "2023-2024"
    amount: z
      .union([z.string(), z.number()])
      .transform((val) => {
        if (typeof val === 'string') {
          const parsed = parseFloat(val);
          if (isNaN(parsed)) {
            throw new Error('Invalid price format');
          }
          return parsed;
        }
        return val;
      })
      .refine((val) => val > 0, {
        message: 'Payment amount must be a positive number',
      }),
    paymentDate: z.coerce.date().transform((date) => date.toISOString()),
    paymentStatus: (schema) => schema.paymentStatus.default('PENDING'),
    paymentMethod: (schema) => schema.paymentMethod.default('CASH'),
    notes: (schema) => schema.notes.optional(),
  },
);

export const updateMemberPaymentInputSchema = createSelectSchema(
  membershipPayments,
)
  .partial()
  .extend({
    id: z.string().uuid(),
  });

export const getMemberPaymentsSchema = createSelectSchema(membershipPayments);

export type MemberPaymentProps = z.infer<typeof getMemberPaymentsSchema>;

export type AddMembershipPaymentInput = z.infer<
  typeof createMemberPaymentInputSchema
>;

// Schema for selecting a membership payment
export const selectMembershipPaymentSchema =
  createSelectSchema(membershipPayments);
export type MembershipPaymentSchema = z.infer<
  typeof selectMembershipPaymentSchema
>;

export type UpdateMemberPaymentInput = z.infer<
  typeof updateMemberPaymentInputSchema
>;

export const deleteMemberPaymentInputSchema = z.object({
  id: z.string(),
});

export type DeleteMembershipPaymentInput = z.infer<
  typeof deleteMemberPaymentInputSchema
>;
