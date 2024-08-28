'use server';

import { unstable_noStore as noStore } from 'next/cache';

import { db } from '@/lib/db/db';
import {
  getUserByEmailSchema,
  getUserByEmailVerificationTokenSchema,
  getUserByIdSchema,
  getUserByResetPasswordTokenSchema,
  type GetUserByEmailInput,
  type GetUserByEmailVerificationTokenInput,
  type GetUserByIdInput,
  type GetUserByResetPasswordTokenInput,
} from '@/modules/auth/data-access/user';
import { members, UserSchema } from '@/modules/members/data-access/schema';
import { sql } from 'drizzle-orm';
import {
  psGetUserByEmail,
  psGetUserByEmailVerificationToken,
  psGetUserById,
  psGetUserByResetPasswordToken,
} from '../data-access/prepared/statements';

export async function getUserById(
  rawInput: GetUserByIdInput,
): Promise<UserSchema | null> {
  try {
    const validatedInput = getUserByIdSchema.safeParse(rawInput);
    if (!validatedInput.success) return null;

    noStore();
    const [user] = await psGetUserById.execute({
      id: validatedInput.data.id,
    });
    return user || null;
  } catch (error) {
    console.error(error);
    throw new Error('Error getting user by id');
  }
}

export async function getUserByEmail(
  rawInput: GetUserByEmailInput,
): Promise<UserSchema | null> {
  try {
    const validatedInput = getUserByEmailSchema.safeParse(rawInput);
    if (!validatedInput.success) return null;

    noStore();
    const [user] = await psGetUserByEmail.execute({
      email: validatedInput.data.email,
    });
    return user || null;
  } catch (error) {
    console.error(error);
    throw new Error('Error getting user by email');
  }
}

export async function checkIfFirstUser(): Promise<boolean> {
  try {
    const result = await db.select({ count: sql`count(*)` }).from(members);
    console.log('checkIfFirstUser', { result });
    // If the count is greater than 0, it means there's at least one user
    //@ts-ignore
    return Number(result[0].count) == 0;
  } catch (error) {
    console.error('Error checking if first user exists:', error);
    throw new Error('Error checking if first user exists');
  }
}

export async function getUserByResetPasswordToken(
  rawInput: GetUserByResetPasswordTokenInput,
): Promise<UserSchema | null> {
  try {
    const validatedInput =
      getUserByResetPasswordTokenSchema.safeParse(rawInput);
    if (!validatedInput.success) return null;

    noStore();
    const [user] = await psGetUserByResetPasswordToken.execute({
      token: validatedInput.data.token,
    });
    return user || null;
  } catch (error) {
    console.error(error);
    throw new Error('Error getting user by reset password token');
  }
}

export async function getUserByEmailVerificationToken(
  rawInput: GetUserByEmailVerificationTokenInput,
): Promise<UserSchema | null> {
  try {
    const validatedInput =
      getUserByEmailVerificationTokenSchema.safeParse(rawInput);
    if (!validatedInput.success) return null;

    noStore();
    const [user] = await psGetUserByEmailVerificationToken.execute({
      token: validatedInput.data.token,
    });
    return user || null;
  } catch (error) {
    console.error(error);
    throw new Error('Error getting user by email verification token');
  }
}
