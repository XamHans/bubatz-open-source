import { UUID } from 'crypto'
import { relations } from 'drizzle-orm'
import {
  boolean,
  date,
  decimal,
  pgEnum,
  pgSchema,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const protectedSchema = pgSchema('protected')

// Enums
export const memberRoleEnum = pgEnum('member_role', ['MEMBER', 'ADMIN'])
export const paymentStatusEnum = pgEnum('payment_status', [
  'PAID',
  'PENDING',
  'OVERDUE',
])

// Table Definitions
export const members = protectedSchema.table('members', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  birthday: date('birthday'),
  image: text('image'),
  email: text('email').unique(),
  phone: text('phone'),
  street: text('street'),
  city: text('city'),
  zip: text('zip'),
  status: text('status').default('PENDING'),
  role: memberRoleEnum('role').default('MEMBER'),
  currentYearPaid: boolean('current_year_paid').default(false),
  lastPaymentDate: date('last_payment_date'),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  emailVerificationToken: text('emailVerificationToken').unique(),
  passwordHash: text('passwordHash'),
  resetPasswordToken: text('resetPasswordToken').unique(),
  resetPasswordTokenExpiry: timestamp('resetPasswordTokenExpiry', {
    mode: 'date',
  }),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
})

export const membershipPayments = protectedSchema.table('membership_payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id')
    .references(() => members.id)
    .notNull(),
  year: text('year').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentDate: date('payment_date'),
  paymentStatus: paymentStatusEnum('payment_status').default('PENDING'),
  paymentMethod: text('payment_method'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

// Relations
export const membersRelations = relations(members, ({ many }) => ({
  buyer: many(members),
}))

export const membershipPaymentsRelations = relations(
  membershipPayments,
  ({ one }) => ({
    member: one(members, {
      fields: [membershipPayments.memberId],
      references: [members.id],
    }),
  }),
)

// Schemas
// Members Schemas
export const addMemberInputSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
  street: z.string().min(1),
  city: z.string().min(1),
  zip: z.string().min(4),
  birthday: z
    .string()
    .regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Birthday must be in DD.MM.YYYY format'),
  status: z.string().default('PENDING'),
  role: z.enum(memberRoleEnum.enumValues).default('MEMBER'),
})

export const selectUserSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  birthday: z.date().nullable(),
  image: z.string().nullable(),
  email: z.string().email(),
  phone: z.string().nullable(),
  street: z.string().nullable(),
  city: z.string().nullable(),
  passwordHash: z.string().nullable(),
  zip: z.string().nullable(),
  status: z.string(),
  role: z.enum(memberRoleEnum.enumValues),
  currentYearPaid: z.boolean(),
  lastPaymentDate: z.date().nullable(),
  emailVerified: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const selectMultipleUsersSchema = z.array(selectUserSchema)

export const updateMemberInputSchema = selectUserSchema.partial().extend({
  id: z.string().uuid(),
  birthday: z.string().transform((date) => new Date(date).toISOString()),
})

export const deleteMemberInputSchema = z.object({
  id: z.string().uuid(),
})

export const getMemberSchemaInput = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  birthday: z.any().optional(), // Changed from Date to string
  image: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  status: z.string().optional(),
  role: z.enum(memberRoleEnum.enumValues).optional(),
  currentYearPaid: z.boolean().optional(),
  lastPaymentDate: z.string().optional(), // Changed from Date to string
  createdAt: z.string().optional(), // Changed from Date to string
  updatedAt: z.string().optional(), // Changed from Date to string
})

// Membership Payments Schemas
export const createMemberPaymentInputSchema = z.object({
  memberId: z.string().uuid(),
  year: z.string().min(4).max(9),
  amount: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        if (isNaN(parsed)) {
          throw new Error('Invalid price format')
        }
        return parsed
      }
      return val
    })
    .refine((val) => val > 0, {
      message: 'Payment amount must be a positive number',
    }),
  paymentDate: z.coerce.date().transform((date) => date.toISOString()),
  paymentStatus: z.enum(paymentStatusEnum.enumValues).default('PENDING'),
  paymentMethod: z.string().default('CASH'),
  notes: z.string().optional(),
})

export const updateMemberPaymentInputSchema = z.object({
  id: z.string().uuid(),
  memberId: z.string().uuid().optional(),
  year: z.string().min(4).max(9).optional(),
  amount: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        if (isNaN(parsed)) {
          throw new Error('Invalid price format')
        }
        return parsed
      }
      return val
    })
    .refine((val) => val > 0, {
      message: 'Payment amount must be a positive number',
    })
    .optional(),
  paymentDate: z.coerce
    .date()
    .transform((date) => date.toISOString())
    .optional(),
  paymentStatus: z.enum(paymentStatusEnum.enumValues).optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
})

export const getMemberPaymentsSchema = z.object({
  id: z.string().uuid(),
  memberId: z.string().uuid(),
  year: z.string(),
  amount: z.number(),
  paymentDate: z.date().nullable(),
  paymentStatus: z.enum(paymentStatusEnum.enumValues),
  paymentMethod: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const selectMembershipPaymentSchema = getMemberPaymentsSchema

export const deleteMemberPaymentInputSchema = z.object({
  id: z.string().uuid(),
})

// Types
export type AddMemberInput = z.infer<typeof addMemberInputSchema>
export type UserSchema = z.infer<typeof selectUserSchema>
export type UpdateMemberInput = z.infer<typeof updateMemberInputSchema>
export type DeleteMemberInput = { id: UUID }
export type MemberProps = z.infer<typeof getMemberSchemaInput>

export type MemberPaymentProps = z.infer<typeof getMemberPaymentsSchema>
export type AddMembershipPaymentInput = z.infer<
  typeof createMemberPaymentInputSchema
>
export type MembershipPaymentSchema = z.infer<
  typeof selectMembershipPaymentSchema
>
export type UpdateMemberPaymentInput = z.infer<
  typeof updateMemberPaymentInputSchema
>
export type DeleteMembershipPaymentInput = z.infer<
  typeof deleteMemberPaymentInputSchema
>
