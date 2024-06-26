'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { BatchProps } from '@/modules/plants/data-access/schema';
import { BatchProvider } from './BatchContext';
import { CurrentPhaseForm } from './Forms/CurrentPhaseForm';
import { GrowthPhasesForm } from './Forms/GrowthPhasesForm';
import { LogTracker } from './LogTracker';
import { PlantsContainer } from './Plants/PlantsContainer';

interface EditBatchContainerProps {
  details: BatchProps;
}
const initialData = {
  germination: {
    date_germinated: '2023-01-20',
    conditions: {
      temperature: '20-25°C',
      humidity: '70-80%',
      light_hours: 18,
    },
  },
  vegetative: {
    start_date: '2023-01-25',
    end_date: '2023-02-25',
    conditions: {
      temperature: '22-28°C',
      humidity: '50-70%',
      light_hours: 18,
    },
    nutrients: {
      type: 'Nutrient Solution A',
      schedule: 'daily',
      ph_level: 6.0,
    },
  },
  flowering: {
    start_date: '2023-02-26',
    estimated_end_date: '2023-04-26',
    conditions: {
      temperature: '20-26°C',
      humidity: '40-50%',
      light_hours: 12,
    },
    nutrients: {
      type: 'Nutrient Solution B',
      schedule: 'every 3 days',
      ph_level: 6.2,
    },
  },
  harvest: {
    estimated_date: '2023-04-27',
    actual_date: null,
    yield_estimate_grams: 500,
    yield_actual_grams: null,
    drying_conditions: {
      temperature: '18-24°C',
      humidity: '45-55%',
    },
  },
  processing: {
    drying_start_date: null,
    drying_end_date: null,
    curing_start_date: null,
    curing_end_date: null,
    trim_date: null,
    packaging_date: null,
    final_weight_grams: null,
  },
  destroyed: {
    weight_grams_destroyed: false,
    destroyed_date: null,
    reason: null,
  },
};

const EditBatchContainer: React.FC<EditBatchContainerProps> = ({ details }) => {
  return (
    <BatchProvider details={details}>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        {/* Card on Left side */}
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          {/* Plants & Add Plant Card */}
          <PlantsContainer />

          {/* Logbook Section */}
          <LogTracker />
        </div>

        {/* Cards on Right Side */}
        <div className="grid auto-rows-max items-start gap-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Grow Phases</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Grow Phase */}
              <div>
                <CurrentPhaseForm />
              </div>
              <div>
                <GrowthPhasesForm data={details.otherDetails} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Archive Batch</CardTitle>
              <CardDescription>
                When you're done with the batch, you can archive it here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div></div>
              <Button size="sm" variant="secondary">
                Archive Batch
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </BatchProvider>
  );
};

export default EditBatchContainer;
