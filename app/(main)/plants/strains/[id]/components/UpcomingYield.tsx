import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BatchProps } from '@/modules/plants/data-access/schema'
import { GrowPhase } from '@/modules/plants/types'

export interface UpcomingYieldProps {
  batches: BatchProps[]
}

const growthStageProgress: Record<GrowPhase, number> = {
  [GrowPhase.Vegetative]: 20,
  [GrowPhase.Flowering]: 40,
  [GrowPhase.Harvesting]: 60,
  [GrowPhase.Drying]: 80,
  [GrowPhase.Curing]: 90,
  [GrowPhase.Completed]: 100,
}

const UpcomingYield = ({ batches }: UpcomingYieldProps) => {
  const calculateProgress = (
    startDate: string | number | Date,
    endDate: string | number | Date,
    currentGrowthStage: GrowPhase,
  ) => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const now = new Date().getTime()
    const timeProgress = ((now - start) / (end - start)) * 100

    // Get the progress based on the current growth stage
    const stageProgress = growthStageProgress[currentGrowthStage] || 0

    // Use the higher of the two progress values
    const progress = Math.max(timeProgress, stageProgress)

    return Math.min(Math.max(progress, 0), 100)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upcoming Yields</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {batches.map((batch) => {
            const progress = calculateProgress(
              batch.startDate,
              batch.endDate,
              batch.currentGrowthStage as GrowPhase,
            )
            return (
              <div key={batch.id} className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-medium">{batch.name}</h4>
                  <span className="text-sm text-gray-500">
                    {batch.currentGrowthStage}
                  </span>
                </div>
                <Progress value={progress} className="mb-2" />
                <div className="flex justify-between text-sm">
                  <span>
                    Started: {new Date(batch.startDate).toLocaleDateString()}
                  </span>
                  <span>
                    Expected End:{' '}
                    {batch.endDate &&
                      new Date(batch.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2 text-sm font-medium">
                  Progress: {Math.round(progress)}%
                </div>
                {batch?.expectedYield && batch?.expectedYield > 0 && (
                  <p className="mt-5 text-lg font-bold">
                    Expected Yield: {batch.expectedYield}g
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default UpcomingYield
