'use server';

import { db } from '@/lib/db/db';
import { AsyncReturnType } from '@/types';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { AddClubInput, UpdateClubInput, clubs } from './schema';

const getClubs = async () => {
  const allClubs = await db.select().from(clubs);
  return allClubs;
};

export const createClub = async (input: AddClubInput) => {
  const newClubId = await db.insert(clubs).values(input).returning();
  return newClubId;
};

const getClubDetail = async (id: string) => {
  const foundClubs = await db
    .select()
    .from(clubs)
    .where(eq(clubs.id, id))
    .limit(1);
  console.log('getClubDetail', foundClubs);
  return foundClubs[0];
};
export type GetClubDetailQueryData = AsyncReturnType<typeof getClubDetail>;

const updateClub = async (data: UpdateClubInput) => {
  try {
    console.log('data', data);
    const updatedClubResult = await db
      .update(clubs)
      .set(data)
      .where(eq(clubs.id, data.id ?? ''));
    return updatedClubResult;
  } catch (error) {
    console.error('Error updating club:', error);
    return { message: 'Failed to update club', error: error };
  }
};

const deleteClub = async (id: string) => {
  try {
    const deletedClub = await db.delete(clubs).where(eq(clubs.id, id));
    return deletedClub;
  } catch (error) {
    console.error('Error deleting club:', error);
    return { message: 'Failed to delete club', error: error };
  }
};

export { deleteClub, getClubDetail, getClubs, updateClub };
