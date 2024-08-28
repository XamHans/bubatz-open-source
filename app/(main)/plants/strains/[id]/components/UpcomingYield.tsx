import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BatchProps } from '@/modules/plants/data-access/schema'

export interface UpcomingYieldProps {
  batches: BatchProps[]
}

const UpcomingYield = ({ batches }: UpcomingYieldProps) => {
  const calculateProgress = (
    startDate: string | number | Date,
    endDate: string | number | Date,
  ) => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const now = new Date().getTime()
    const progress = ((now - start) / (end - start)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upcoming Yields</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {batches.map((batch) => (
            <div key={batch.id} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium">{batch.name}</h4>
                <span className="text-sm text-gray-500">
                  {batch.currentGrowthStage}
                </span>
              </div>
              <Progress
                value={calculateProgress(batch.startDate, batch.endDate)}
                className="mb-2"
              />
              <div className="flex justify-between text-sm">
                <span>
                  Started: {new Date(batch.startDate).toLocaleDateString()}
                </span>
                <span>
                  Expected End: {new Date(batch.endDate).toLocaleDateString()}
                </span>
              </div>
              {batch?.expectedYield && batch?.expectedYield > 0 && (
                <p className="mt-5 text-lg font-bold">
                  Expected Yield: {batch.expectedYield}g
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default UpcomingYield
