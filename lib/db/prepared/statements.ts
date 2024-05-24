import { eq, sql } from 'drizzle-orm'

import { db } from '@/lib/db/db'
import { users } from '@/lib/db/schema'

export const psGetAllClients = db
    .select()
    .from(users)
    .where(eq(users.role, 'USER'))
    .prepare('psGetAllClients')

export const psGetUserById = db
    .select()
    .from(users)
    .where(eq(users.id, sql.placeholder('id')))
    .prepare('psGetUserById')

export const psGetUserByEmail = db
    .select()
    .from(users)
    .where(eq(users.email, sql.placeholder('email')))
    .prepare('psGetUserByEmail')

export const psGetUserByEmailVerificationToken = db
    .select()
    .from(users)
    .where(eq(users.emailVerificationToken, sql.placeholder('token')))
    .prepare('psGetUserByEmailVerificationToken')

export const psGetUserByResetPasswordToken = db
    .select()
    .from(users)
    .where(eq(users.resetPasswordToken, sql.placeholder('token')))
    .prepare('psGetUserByResetPasswordToken')

export const psLinkOAuthAccount = db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.id, sql.placeholder('userId')))
    .prepare('psLinkOAuthAccount')
