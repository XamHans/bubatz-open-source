'use server';

import { AsyncReturnType } from '@/lib/types';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { members } from './schema';
import { UpdateMemberInput } from './types';
const connectionString = process.env.DATABASE_URL
const client = postgres(connectionString!, { prepare: false })
const db = drizzle(client);

// Enhanced Either type
interface Either<L, R> {
  onSuccess<T>(f: (value: R) => T): Either<L, T>;
  onError<T>(f: (value: L) => T): Either<T, R>;
}

class Left<L> implements Either<L, never> {
  constructor(private value: L) {}

  onSuccess<T>(_: (value: never) => T): Either<L, T> {
    return this; // No-op for Left
  }

  onError<T>(f: (value: L) => T): Either<T, never> {
    return new Left(f(this.value));
  }
}

class Right<R> implements Either<never, R> {
  constructor(private value: R) {}

  onSuccess<T>(f: (value: R) => T): Either<never, T> {
    return new Right(f(this.value)); // Apply the function if Right
  }

  onError<T>(_: (value: never) => T): Either<T, R> {
    return this; // No-op for Right
  }
}

type UpdateError = {
    message: string;
    error: unknown;
}

type DB_SUCCESS = "DB_SUCCESS";

// Factory functions for convenience
const left = <L>(value: L): Either<L, never> => new Left(value);
const right = <R>(value: R): Either<never, R> => new Right(value);


const getMembers = async () => {
    const allMembers = await db.select().from(members);
    return allMembers;
}
export type GetMembersQueryData = AsyncReturnType<typeof getMembers>


const getMemberDetail = async (id: string) => {
    const foundMembers = await db.select().from(members).where(eq(members.id, id)).limit(1);
    console.log('getMemberDetail' , foundMembers)
    return foundMembers[0];
}
export type GetMemberDetailQueryData = AsyncReturnType<typeof getMemberDetail>



const updateMember = async (id: string, data: UpdateMemberInput): Promise<Either<UpdateError, DB_SUCCESS>> => {
    try {
    // Simulate the database operation
    const updatedMemberResult = await db.update(members).set({ ...data }).where(eq(members.id, id));
    console.log('updateMember', updatedMemberResult);
    return right('DB_SUCCESS');
  } catch (error) {
    console.error('Error updating member:', error);
    return left({ message: 'Failed to update member', error: error });
  }
}



export { getMemberDetail, getMembers, updateMember };

