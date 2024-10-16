'use server'

import { logger } from '@/lib/logger'
import { actionClient } from '@/lib/server-clients'
import { SuccessResponse } from '@/types'
import { z } from 'zod'
import {
  PlantDetailsData,
  createBatch,
  createPlant,
  createStrain,
  deletePlant,
  deleteStrain,
  getBatchById,
  getBatches,
  getBatchesByStrainId,
  getPlants,
  getPlantsByBatchId,
  getStrainById,
  getStrains,
  updateBatch,
  updatePlant,
  updateStrain,
} from '../data-access'
import {
  BatchProps,
  StrainProps,
  createBatchInputSchema,
  createPlantInputSchema,
  createStrainInputSchema,
  deletePlantInputSchema,
  deleteStrainInputSchema,
  fetchBatchesInputSchema,
  getBatchDetailSchema,
  getBatchesByStrainIdSchema,
  getStrainDetailSchema,
  updateBatchInputSchema,
  updatePlantInputSchema,
  updateStrainInputSchema,
} from '../data-access/schema'

// -------------- Batches
export const createBatchUseCase = actionClient
  .schema(createBatchInputSchema)
  .action(async ({ parsedInput }) => {
    const newBatch = await createBatch(parsedInput)
    return { success: newBatch.id }
  })

export const fetchBatchesUseCase = actionClient
  .schema(fetchBatchesInputSchema)
  .action(async ({ parsedInput }) => {
    const batches = await getBatches(parsedInput.isArchived)
    if (!batches) {
      return { failure: 'Batch not found' }
    }
    return { success: batches }
  })

export const fetchBatchDetailsUseCase = actionClient
  .schema(getBatchDetailSchema)
  .action(async ({ parsedInput }) => {
    logger.info('fetching batch details for id:', parsedInput.id)
    const res = await getBatchById(parsedInput.id)
    if (!res) {
      return { failure: 'Batch not found' }
    }
    return { success: { batch: res.batches, strain: res.strains } }
  })

export const updateBatchUseCase = actionClient
  .schema(updateBatchInputSchema)
  .action(async ({ parsedInput }) => {
    const existingBatch = await getBatchById(parsedInput.id)

    if (!existingBatch) {
      return { failure: "Batch not found, can't update batch" }
    }
    if (parsedInput.totalYield && Number(parsedInput.totalYield) > 0) {
      // yield changed we need to update strain values as well
      const res = await updateStrain({
        id: existingBatch?.strains?.id!,
        amountAvailable: parsedInput.totalYield,
      })
      console.log('res yield total update strain', res)

      if (!res) {
        return { failure: 'Failed to update amountAvailable of strain ' }
      }
    }
    const result = await updateBatch(parsedInput.id, parsedInput)
    return { success: [result] }
  })

//----------------- Plants
export type FetchPlantsSuccess = SuccessResponse<{
  plants: PlantDetailsData[]
}>

export const fetchPlantsFromBatchUseCase = actionClient
  .schema(z.object({ batchId: z.string() }))
  .action(async ({ parsedInput }) => {
    const plants = (await getPlantsByBatchId(parsedInput.batchId)) ?? []

    return { success: { plants } }
  })

export const fetchPlantsUseCase = actionClient.action(async () => {
  const plants = await getPlants()
  return { success: plants }
})

export const createPlantUseCase = actionClient
  .schema(createPlantInputSchema)
  .action(async ({ parsedInput }) => {
    logger.info(parsedInput, 'Creating plant with data:')
    const newPlantId = await createPlant(parsedInput)
    logger.info(newPlantId, 'Creating plant id:')
    if (!newPlantId) {
      return { failure: 'Failed to create plant' }
    }
    return { success: newPlantId }
  })

export const deletePlantUseCase = actionClient
  .schema(deletePlantInputSchema)
  .action(async ({ parsedInput }) => {
    logger.info('Deleting plant with id:', parsedInput.id)
    try {
      await deletePlant(parsedInput)
    } catch (error) {
      logger.error('Error deleting plant', error)
      return { failure: 'Failed to delete plant' }
    }
    return { success: 'Plant deleted successfully' }
  })

export const updatePlantUseCase = actionClient
  .schema(updatePlantInputSchema)
  .action(async ({ parsedInput }) => {
    logger.info('Updating plant with:', parsedInput)
    await updatePlant(parsedInput.id!, parsedInput)
    return { success: 'Plant updated successfully' }
  })

// -------------- Strains
export const fetchStrainsUseCase = actionClient.action(async () => {
  const strains = await getStrains()

  return { success: strains }
})

export const fetchBatchesByStrainIdUseCase = actionClient
  .schema(getBatchesByStrainIdSchema)
  .action(async ({ parsedInput }) => {
    const batches = await getBatchesByStrainId(parsedInput.strainId!)

    return { success: batches }
  })

export const fetchStrainDetailsUseCase = actionClient
  .schema(getStrainDetailSchema)
  .action(async ({ parsedInput }) => {
    const strain = await getStrainById(parsedInput.id)
    if (!strain) {
      return { failure: 'Strain not found' }
    }
    return { success: strain }
  })

export const createStrainUseCase = actionClient
  .schema(createStrainInputSchema)
  .action(async ({ parsedInput }) => {
    logger.info('Creating strain with data:', parsedInput)
    const newStrainId = await createStrain(parsedInput)
    if (!newStrainId) {
      return { failure: 'Failed to create strain' }
    }
    return { success: newStrainId }
  })

export const updateStrainUseCase = actionClient
  .schema(updateStrainInputSchema)
  .action(async ({ parsedInput }) => {
    const updatedStrain = await updateStrain(parsedInput)
    if (!updatedStrain) {
      return { failure: 'Failed to create strain' }
    }
    return { success: updatedStrain }
  })

export const deleteStrainUseCase = actionClient
  .schema(deleteStrainInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const res = await deleteStrain({ id: parsedInput.id })
    } catch (error) {
      logger.error(error, 'Error deleting Strain')
      return { failure: 'Failed to delete Strain' }
    }
    return { success: 'Strain deleted successfully' }
  })

type FetchBatchDetailsSuccess = {
  success: {
    batch: BatchProps
    strain: StrainProps
  }
}

type FetchBatchDetailsFailure = {
  failure: string
}

type FetchBatchDetailsResult =
  | FetchBatchDetailsSuccess
  | FetchBatchDetailsFailure
