'use server';

import { db } from '@/lib/db/db';
import getLogger from '@/lib/logger';
import { AddClubInput, members } from './schema';
const logger = getLogger();
/**
 * Here is an example CRUD methods for the club table.
 * If you plan to keep your code base "clean", we recommend
 * no where else know about dizzle other than your data-access directory.
 */
export const getMembers = async () => {
  const allMembers = await db.select().from(members);
  console.log('allmembers', allMembers);
  return allMembers;
};

export const createClub = async (input: AddClubInput) => {
  logger.debug('Creating new club', input);
  const newClubId = await db
    .insert(members)
    .values(input)
    .returning({ insertedId: members.id });
  return newClubId;
};
