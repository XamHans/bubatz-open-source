'use server';

import { logger } from '@/lib/logger';
import { actionClient } from '@/lib/server-clients';
import { SuccessResponse } from '@/types';
import { z } from 'zod';
import {
  PlantDetailsData,
  createBatch,
  createPlant,
  createStrain,
  deletePlant,
  getBatchById,
  getBatches,
  getPlants,
  getPlantsByBatchId,
  getStrains,
  updateBatch,
  updatePlant,
} from '../data-access';
import {
  BatchProps,
  StrainProps,
  createBatchInputSchema,
  createPlantInputSchema,
  createStrainInputSchema,
  deletePlantInputSchema,
  getBatchDetailSchema,
  updateBatchInputSchema,
  updatePlantInputSchema,
} from '../data-access/schema';

// -------------- Batches
export const addBatchUseCase = actionClient
  .schema(createBatchInputSchema)
  .action(async ({ parsedInput }) => {
    logger.info('Creating batch with data:', parsedInput);
    console.log('new start date ', parsedInput.startDate);
    const newBatchId = await createBatch(parsedInput);
    return { success: newBatchId };
  });

export const fetchBatchesUseCase = actionClient.action(async () => {
  const batches = await getBatches();
  return { batches };
});

export const fetchBatchDetailsUseCase = actionClient
  .schema(getBatchDetailSchema)
  .action(async ({ parsedInput }) => {
    logger.info('fetching batch details for id:', parsedInput.id);
    const res = await getBatchById(parsedInput.id);
    if (!res) {
      return { failure: 'Batch not found' };
    }
    return { success: { batch: res.batches, strain: res.strains } };
  });

export const updateBatchUseCase = actionClient
  .schema(updateBatchInputSchema)
  .action(async ({ parsedInput }) => {
    const existingBatch = await getBatchById(parsedInput.id);
    if (!existingBatch) {
      return { failure: "Batch not found, can't update batch" };
    }
    const result = await updateBatch(parsedInput.id, parsedInput);
    logger.info('Updated batch result ', result);
    return { success: 'Batch updated successfully' };
  });

//----------------- Plants
export type FetchPlantsSuccess = SuccessResponse<{
  plants: PlantDetailsData[];
}>;

export const fetchPlantsFromBatchUseCase = actionClient
  .schema(z.object({ batchId: z.string() }))
  .action(async ({ parsedInput }) => {
    const plants = await getPlantsByBatchId(parsedInput.batchId);
    if (!plants) {
      return { failure: 'plants not found' };
    }
    return { success: { plants } };
  });

export const fetchPlantsUseCase = actionClient.action(async () => {
  const plants = await getPlants();
  return { plants };
});

export const createPlantUseCase = actionClient
  .schema(createPlantInputSchema)
  .action(async ({ parsedInput }) => {
    logger.info('Creating plant with data:', parsedInput);
    const newPlantId = await createPlant(parsedInput);
    logger.info('Creating plant id:', newPlantId);
    if (!newPlantId) {
      return { failure: 'Failed to create plant' };
    }
    return { success: newPlantId };
  });

export const deletePlantUseCase = actionClient
  .schema(deletePlantInputSchema)
  .action(async ({ parsedInput }) => {
    logger.info('Deleting plant with id:', parsedInput.id);
    try {
      await deletePlant(parsedInput);
    } catch (error) {
      logger.error('Error deleting plant', error);
      return { failure: 'Failed to delete plant' };
    }
    return { success: 'Plant deleted successfully' };
  });

export const updatePlantUseCase = actionClient
  .schema(updatePlantInputSchema)
  .action(async ({ parsedInput }) => {
    logger.info('Updating plant with:', parsedInput);
    await updatePlant(parsedInput.id!, parsedInput);
    return { success: 'Plant updated successfully' };
  });

// -------------- Strains
export const fetchStrainsUseCase = actionClient.action(async () => {
  const strains = await getStrains();

  return { success: strains };
});

export const createStrainUseCase = actionClient
  .schema(createStrainInputSchema)
  .action(async ({ parsedInput }) => {
    logger.info('Creating strain with data:', parsedInput);
    const newStrainId = await createStrain(parsedInput);
    if (!newStrainId) {
      return { failure: 'Failed to create strain' };
    }
    return { success: newStrainId };
  });

type FetchBatchDetailsSuccess = {
  success: {
    batch: BatchProps;
    strain: StrainProps;
  };
};

type FetchBatchDetailsFailure = {
  failure: string;
};

type FetchBatchDetailsResult =
  | FetchBatchDetailsSuccess
  | FetchBatchDetailsFailure;
