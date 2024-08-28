import * as z from 'zod'

import { members } from '@/modules/members/data-access/schema'
import { emailSchema } from '@/validations/email'
import { memberIdSchema, passwordSchema } from './auth'

export const userSchema = z.object({
  role: z
    .enum(members.role.enumValues, {
      required_error: 'Role is required',
      invalid_type_error: 'Role must be a string',
    })
    .default('MEMBER'),
  email: emailSchema,
  password: passwordSchema,
})

export const getUserByEmailSchema = z.object({
  email: emailSchema,
})

export const getUserByIdSchema = z.object({
  id: memberIdSchema,
})

export const getUserByResetPasswordTokenSchema = z.object({
  token: z.string(),
})

export const getUserByEmailVerificationTokenSchema = z.object({
  token: z.string(),
})

export const addUserAsAdminSchema = userSchema
  .extend({
    confirmPassword: passwordSchema,
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const updateUserAsAdminSchema = userSchema
  .omit({
    password: true,
  })
  .extend({
    id: memberIdSchema,
    createdAt: z.date(),
  })

export const updateUserSchema = userSchema
  .omit({
    role: true,
  })
  .extend({
    confirmPassword: passwordSchema,
  })

export const deleteUserSchema = z.object({
  id: memberIdSchema,
})

export const checkIfUserExistsSchema = z.object({
  id: memberIdSchema,
})

export type GetUserByEmailInput = z.infer<typeof getUserByEmailSchema>

export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>

export type GetUserByResetPasswordTokenInput = z.infer<
  typeof getUserByResetPasswordTokenSchema
>

export type GetUserByEmailVerificationTokenInput = z.infer<
  typeof getUserByEmailVerificationTokenSchema
>

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export type DeleteUserInput = z.infer<typeof deleteUserSchema>

export type CheckIfUserExistsInput = z.infer<typeof checkIfUserExistsSchema>
