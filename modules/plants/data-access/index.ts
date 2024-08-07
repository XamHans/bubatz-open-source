'use server';

import { db } from '@/lib/db/db';
import { AsyncReturnType } from '@/lib/types';
import { eq } from 'drizzle-orm/sql';
import {
  CreateBatchInput,
  CreatePlantInput,
  DeletePlantInput,
  UpdateBatchInput,
  UpdatePlantInput,
  batches,
  plants,
  strains,
} from './schema';
/**
 * Here is an example CRUD methods for the plants table.
 * If you plan to keep your code base "clean", we recommend
 * no where else know about dizzle other than your data-access directory.
 */

//-------------------------------------------------------------------------

const getBatches = async () => {
  const allBatches = await db.select().from(batches);
  console.log('allBatches', allBatches);
  return allBatches;
};

export const createBatch = async (input: CreateBatchInput) => {
  console.log('input', input);
  const newBatchId = await db
    .insert(batches)
    .values(input)
    .returning({ insertedId: batches.id });
  return newBatchId;
};

export const updateBatch = async (id: string, data: UpdateBatchInput) => {
  return await db.update(batches).set(data).where(eq(batches.id, id));
};

const getBatchDetail = async (id: string) => {
  const foundBatches = await db
    .select()
    .from(batches)
    .where(eq(batches.id, id))
    .limit(1);
  console.log(' foundBatches[0];', foundBatches[0]);
  return foundBatches[0];
};

export const getBatchById = async (id: string) => {
  const result = await db
    .select()
    .from(batches)
    .leftJoin(strains, eq(batches.strainId, strains.id))
    .where(eq(batches.id, id))
    .limit(1);
  console.log('result[0]', result[0]);
  return result[0];
};

const getPlants = async () => {
  const allPlants = await db.select().from(plants);
  return allPlants;
};

export const getStrains = async () => {
  const allStrains = await db.select().from(strains);
  return allStrains;
};

export const getPlantsByBatchId = async (batchId: string) => {
  return await db.select().from(plants).where(eq(plants.batchId, batchId));
};

export const createPlant = async (input: CreatePlantInput) => {
  return await db.insert(plants).values(input);
};

export const deletePlant = async (input: DeletePlantInput) => {
  return await db.delete(plants).where(eq(plants.id, input.id));
};

export const updatePlant = async (id: number, data: UpdatePlantInput) => {
  return await db.update(plants).set(data).where(eq(plants.id, id));
};

export type BatchDetailsData = AsyncReturnType<typeof getBatchDetail>;
export type PlantDetailsData = AsyncReturnType<typeof getPlantsByBatchId>;

export { getBatchDetail, getBatches, getPlants };
