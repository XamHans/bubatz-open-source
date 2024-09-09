'use server'

import { db } from '@/lib/db/db'
import { AsyncReturnType } from '@/types'
import { and, eq } from 'drizzle-orm'
import {
  CreateBatchInput,
  CreatePlantInput,
  CreateStrainInput,
  DeletePlantInput,
  DeleteStrainInput,
  UpdateBatchInput,
  UpdatePlantInput,
  UpdateStrainInput,
  batches,
  plants,
  strains,
} from './schema'
/**
 * Here is an example CRUD methods for the plants table.
 * If you plan to keep your code base "clean", we recommend
 * no where else know about dizzle other than your data-access directory.
 */

//-------------------------------------------------------------------------

const getBatches = async (archived?: boolean) => {
  const query = db
    .select({
      id: batches.id,
      name: batches.name,
      startDate: batches.startDate,
      endDate: batches.endDate,
      strainName: strains.name,
      currentGrowPhase: batches.currentGrowthStage,
    })
    .from(batches)
    .leftJoin(strains, eq(batches.strainId, strains.id))

  if (archived !== undefined) {
    query.where(eq(batches.isArchived, archived))
  }

  const allBatches = await query

  return allBatches
}

export const createBatch = async (input: CreateBatchInput) => {
  //@ts-ignore
  const newBatch = await db.insert(batches).values(input).returning()
  return newBatch[0]
}

export const updateBatch = async (id: string, data: UpdateBatchInput) => {
  return await db
    .update(batches)
    .set(data as any)
    .where(eq(batches.id, id))
    .returning()
}

const getBatchDetail = async (id: string) => {
  const foundBatches = await db
    .select()
    .from(batches)
    .where(eq(batches.id, id))
    .limit(1)
  console.log(' foundBatches[0];', foundBatches[0])
  return foundBatches[0]
}

export const getBatchById = async (id: string) => {
  const result = await db
    .select()
    .from(batches)
    .leftJoin(strains, eq(batches.strainId, strains.id))
    .where(eq(batches.id, id))
    .limit(1)
  return result[0]
}

export const getBatchesByStrainId = async (strainId: number) => {
  const result = await db
    .select()
    .from(batches)
    .where(and(eq(batches.strainId, strainId), eq(batches.isArchived, false)))
  return result
}

const getPlants = async () => {
  const allPlants = await db.select().from(plants)
  return allPlants
}

export const getPlantsByBatchId = async (batchId: string) => {
  return await db.select().from(plants).where(eq(plants.batchId, batchId))
}

export const createPlant = async (input: CreatePlantInput) => {
  return await db.insert(plants).values(input as any)
}

export const deletePlant = async (input: DeletePlantInput) => {
  return await db.delete(plants).where(eq(plants.id, input.id))
}

export const updatePlant = async (id: number, data: UpdatePlantInput) => {
  return await db
    .update(plants)
    .set(data as any)
    .where(eq(plants.id, id))
}

export type BatchDetailsData = AsyncReturnType<typeof getBatchDetail>
export type PlantDetailsData = AsyncReturnType<typeof getPlantsByBatchId>

export { getBatchDetail, getBatches, getPlants }

export const getStrains = async () => {
  const allStrains = await db.select().from(strains)
  return allStrains
}

export const getStrainById = async (id: number) => {
  const result = await db
    .select()
    .from(strains)
    .where(eq(strains.id, id))
    .limit(1)
  return result[0]
}

export const createStrain = async (input: CreateStrainInput) => {
  const newStrain = await db
    .insert(strains)
    .values(input as any)
    .returning()
  console.info('newStrain', newStrain)
  return newStrain[0]
}

export const updateStrain = async (input: UpdateStrainInput) => {
  return await db
    .update(strains)
    .set(input as any)
    .where(eq(strains.id, input.id))
    .returning()
}

export const deleteStrain = async (input: DeleteStrainInput) => {
  return await db.delete(strains).where(eq(strains.id, input.id))
}
