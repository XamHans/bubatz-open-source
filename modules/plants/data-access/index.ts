'use server';

import { db } from '@/lib/db/db';
import getLogger from '@/lib/logger';
import { AsyncReturnType } from '@/lib/types';
import { eq } from 'drizzle-orm/sql';
import { CreateBatchInput, batches, plants } from './schema';
const logger = getLogger();
/**
 * Here is an example CRUD methods for the plants table.
 * If you plan to keep your code base "clean", we recommend
 * no where else know about dizzle other than your data-access directory.
 */
const getPlants = async () => {
  const allPlants = await db.select().from(plants);
  logger.debug('getPlants', getPlants);
  return allPlants;
};
//-------------------------------------------------------------------------

const getBatches = async () => {
  const allBatches = await db.select().from(batches);
  console.log('allBatches', allBatches);
  return allBatches;
};

export const createBatch = async (input: CreateBatchInput) => {
  logger.debug('Creating new batch', input);
  const newBatchId = await db
    .insert(batches)
    .values({ ...input })
    .returning({ insertedId: batches.id });
  return newBatchId;
};

const getBatchDetail = async (id: string) => {
  const foundBatches = await db
    .select()
    .from(batches)
    .where(eq(batches.id, id))
    .limit(1);
  return foundBatches[0];
};

export type GetBatchDetailQueryData = AsyncReturnType<typeof getBatchDetail>;

export { getBatchDetail, getBatches, getPlants };
