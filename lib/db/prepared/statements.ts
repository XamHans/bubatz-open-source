import { eq, sql } from 'drizzle-orm';

import { db } from '@/lib/db/db';
import { members } from '@/modules/members/data-access/schema';

export const psGetUserById = db
  .select()
  .from(members)
  .where(eq(members.id, sql.placeholder('id')))
  .prepare('psGetUserById');

export const psGetUserByEmail = db
  .select()
  .from(members)
  .where(eq(members.email, sql.placeholder('email')))
  .prepare('psGetUserByEmail');

export const psGetUserByEmailVerificationToken = db
  .select()
  .from(members)
  .where(eq(members.emailVerificationToken, sql.placeholder('token')))
  .prepare('psGetUserByEmailVerificationToken');

export const psGetUserByResetPasswordToken = db
  .select()
  .from(members)
  .where(eq(members.resetPasswordToken, sql.placeholder('token')))
  .prepare('psGetUserByResetPasswordToken');

export const psLinkOAuthAccount = db
  .update(members)
  .set({ emailVerified: new Date() })
  .where(eq(members.id, sql.placeholder('userId')))
  .prepare('psLinkOAuthAccount');
