'use server';

import { logger } from '@/lib/logger';
import { SuccessResponse } from '@/types';
import dayjs from 'dayjs'; // Import dayjs
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import {
  PlantDetailsData,
  createBatch,
  createPlant,
  deletePlant,
  getBatchById,
  getBatches,
  getPlants,
  getPlantsByBatchId,
  updateBatch,
  updatePlant,
} from '../data-access';
import {
  createBatchInputSchema,
  createPlantInputSchema,
  deletePlantInputSchema,
  updateBatchInputSchema,
  updatePlantInputSchema,
} from '../data-access/schema';

const action = createSafeActionClient({
  middleware(parsedInput, data) {
    logger.info('Parsed input:', parsedInput);
    logger.info('Data:', data);
  },
});

// -------------- Batches
export const addBatchUseCase = action(
  createBatchInputSchema,
  async ({ ...data }) => {
    // Convert date string to Date object and format as yyyy-mm-dd
    if (data.startDate) {
      // Check if startDate is a valid date string
      const parsedDate = dayjs(data.startDate);
      if (!parsedDate.isValid()) {
        return { failure: 'Invalid date format provided for startDate' };
      }
      // Format date to YYYY-MM-DD
      data.startDate = parsedDate.format('YYYY-MM-DD');
    }
    console.log('new start date ', data.startDate);
    const newBatchId = await createBatch(data);
    return { success: newBatchId };
  },
);

export const fetchBatchesUseCase = action({}, async () => {
  const batches = await getBatches();
  return { batches };
});

export const fetchBatchDetailsUseCase = action(
  { batchId: z.string() },
  async ({ batchId }) => {
    logger.info('fetching batch details for id:', batchId);
    const batch = await getBatchById(batchId);
    if (!batch) {
      return { failure: 'Batch not found' };
    }

    // const plants = await getPlantsByBatchId(id);
    return { success: { batch } };
  },
);
export const updateBatchUseCase = action(
  updateBatchInputSchema,
  async ({ id, ...data }) => {
    console.log('inside update  batch use case', id, data);
    const existingBatch = await getBatchById(id);
    if (!existingBatch) {
      return { failure: "Batch not found, can't update batch" };
    }

    // Convert date string to Date object and format as yyyy-mm-dd
    // if (data.startDate) {
    //   const parsedDate = dayjs(data.startDate);
    //   if (!parsedDate.isValid()) {
    //     return { failure: 'Invalid date format provided for startDate' };
    //   }
    //   data.startDate = parsedDate.format('YYYY-MM-DD');
    // }

    const result = await updateBatch(id, data);
    logger.info('Updated batch result ', result);
    return { success: 'Batch updated successfully' };
  },
);

//----------------- Plants
export type FetchPlantsSuccess = SuccessResponse<{
  plants: PlantDetailsData[];
}>;
export const fetchPlantsFromBatchUseCase = action(
  { batchId: z.string() },
  async ({ batchId }) => {
    const plants = await getPlantsByBatchId(batchId);
    if (!plants) {
      return { failure: 'plants not found' };
    }
    console.log('fetchPlantsFromBatchUseCase ', plants);
    // const plants = await getPlantsByBatchId(id);
    return { success: { plants } } as FetchPlantsSuccess;
  },
);

export const fetchPlantsUseCase = action({}, async () => {
  const plants = await getPlants();

  return { plants };
});

export const createPlantUseCase = action(
  createPlantInputSchema,
  async (data) => {
    logger.info('Creating plant with data:', data);
    const newPlantId = await createPlant(data);
    logger.info('Creating plant id:', newPlantId);
    if (!newPlantId) {
      return { failure: 'Failed to create plant' };
    }
    return { success: newPlantId };
  },
);

export const deletePlantUseCase = action(
  deletePlantInputSchema,
  async ({ id, batchId }) => {
    logger.info('Deleting plant with id:', id);
    await deletePlant({ id, batchId });

    return { success: 'Plant deleted successfully' };
  },
);

export const updatePlantUseCase = action(
  updatePlantInputSchema,
  async (data) => {
    logger.info('Updating plant with:', data);
    await updatePlant(data.id!, data);

    return { success: 'Plant updated successfully' };
  },
);
