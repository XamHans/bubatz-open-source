/* eslint-disable react/no-unescaped-entities */
'use client'

import { GenericModal } from '@/components/generic/GenericModal'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PlantDetailsData } from '@/modules/plants/data-access'
import {
  BatchProps,
  CreatePlantInput,
  createPlantInputSchema,
} from '@/modules/plants/data-access/schema'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import {
  createPlantUseCase,
  fetchPlantsFromBatchUseCase,
} from '@/modules/plants/use-cases'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PlantsTable } from './PlantsTable'

export interface PlantsContainerProps {
  batch: BatchProps
}

const PlantsContainer = ({ batch }: PlantsContainerProps) => {
  const [open, setOpen] = useState(false)
  const [plants, setPlants] = useState<PlantDetailsData[]>([])
  const { toast } = useToast()
  const batchId = batch.id

  const { execute } = useAction(fetchPlantsFromBatchUseCase, {
    onSuccess: (data) => {
      const { plants } = data?.success as any
      setPlants(plants)
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Plants could not be fetched: ${error}`,
        duration: 5000,
      })
    },
  })

  const { execute: createPlantExecute } = useAction(createPlantUseCase, {
    onSuccess: () => {
      toast({
        title: 'Success',
        duration: 5000,
        description: `Plant created successfully`,
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        duration: 5000,
        description: `Plant could not be created: ${error}`,
      })
    },
  })

  const form = useForm<CreatePlantInput>({
    resolver: zodResolver(createPlantInputSchema),
    defaultValues: {
      name: '',
      position: '',
      batchId,
      health: 'HEALTHY',
    },
  })

  const onSubmit = (data: CreatePlantInput) => {
    createPlantExecute({ ...data, batchId })
    setOpen(false)
  }

  useEffect(() => {
    execute({ batchId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plants</CardTitle>
        <CardDescription>Manage plants in this batch</CardDescription>
      </CardHeader>
      <CardContent>
        <PlantsTable batch={batch} />
      </CardContent>
      <CardFooter className="justify-center border-t p-4">
        <GenericModal
          headerTitle="Add New Plant"
          description="Fill out the details below to add a new plant to the batch."
          open={open}
          setOpen={setOpen}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-2 sm:grid-cols-2 md:gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Name
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="ml-1 h-4 w-4 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Give the plant a unique name if you'd like. This
                              is optional but can help identify individual
                              plants.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a name for the plant (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Position
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="ml-1 h-4 w-4 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Enter the physical location of the plant within
                              the batch, e.g., "Row 1, Column 3" or "Northwest
                              corner".
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the position of the plant in the batch"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </GenericModal>
      </CardFooter>
    </Card>
  )
}

export { PlantsContainer }
