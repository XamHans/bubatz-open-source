'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BatchProps } from '@/modules/plants/data-access/schema'
import ArchiveBatchModal from './ArchiveBatchModal'
import { BatchEditForm } from './BatchEditForm'
import { PlantsContainer } from './Plants/PlantsContainer'

interface EditBatchContainerProps {
  batch: BatchProps | any
}

const EditBatchContainer = ({ batch }: EditBatchContainerProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_250px] md:gap-8 lg:grid-cols-3 lg:gap-12">
      {/* Card on Left side */}
      <div className="grid auto-rows-max items-start gap-6 lg:col-span-2 lg:gap-8">
        {/* Plants & Add Plant Card */}
        <PlantsContainer batch={batch} />

        {/* Logbook Section SOON */}
        {/* <LogTracker /> */}
      </div>

      {/* Cards on Right Side */}
      <div className="grid auto-rows-max items-start gap-6 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Batch Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Grow Phase */}
            <BatchEditForm batch={batch} />
          </CardContent>
        </Card>

        <ArchiveBatchModal id={batch.id as string} />
      </div>
    </div>
  )
}

export default EditBatchContainer
