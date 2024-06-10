'use server';

import getLogger from '@/lib/logger';
import { createSafeActionClient } from 'next-safe-action';
import { createBatch, getBatches, getPlants } from '../data-access';
import { createBatchInputSchema } from '../data-access/schema';

const action = createSafeActionClient();
const logger = getLogger();

export const fetchPlantsUseCase = action({}, async () => {
  const plants = await getPlants();

  return { plants };
});

export const addBatchUseCase = action(
  createBatchInputSchema,
  async ({ ...data }) => {
    console.log('data', data);
    if (!data) {
      return { failure: "No data provided, can't create new batch" };
    }
    logger.debug('Creating new batch addBatchUseCase', data);
    const newBatchId = await createBatch(data);
    return { success: newBatchId };
  },
);

export const fetchBatchesUseCase = action({}, async () => {
  logger.debug('Fetching batches from database');
  const batches = await getBatches();
  return { batches };
});
