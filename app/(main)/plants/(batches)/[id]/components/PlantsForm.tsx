'use client';

import { GenericSheet } from '@/components/generic/GenericSheet';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { fetchPlantsFromBatchUseCase } from '@/modules/plants/use-cases';
import { useAction } from 'next-safe-action/hooks';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export interface PlantFormProps {
  batchId: string;
}

const PlantsForm: React.FC<PlantFormProps> = ({ batchId }) => {
  const form = useForm();

  const { execute } = useAction(fetchPlantsFromBatchUseCase, {
    onSuccess: (data) => console.log('Plants ', data),
    onError: (error) => console.log('Error fetching plants by batch', error),
  });

  useEffect(() => {
    execute({ batchId });
  }, [batchId, execute]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plants</CardTitle>
        <CardDescription>Manage plants in this batch</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Yield</TableHead>
              <TableHead className="w-[100px]">Health</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">GGPC-001</TableCell>
              <TableCell>
                <Label htmlFor="stock-1" className="sr-only">
                  Stock
                </Label>
                <Input id="stock-1" type="number" defaultValue="100" />
              </TableCell>
              <TableCell>
                <Label htmlFor="price-1" className="sr-only">
                  Price
                </Label>
                <Input id="price-1" type="number" defaultValue="99.99" />
              </TableCell>
              <TableCell>
                <ToggleGroup type="single" defaultValue="s" variant="outline">
                  <ToggleGroupItem value="s">S</ToggleGroupItem>
                  <ToggleGroupItem value="m">M</ToggleGroupItem>
                  <ToggleGroupItem value="l">L</ToggleGroupItem>
                </ToggleGroup>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-center border-t p-4">
        <GenericSheet
          headerTitle="Add New Plant"
          description="Fill out the details below to add a new plant to the batch."
          onSave={() => console.log('Save plant')} // Adjust logic as needed
          onAbort={() => console.log('Abort')}
        >
          <div className="grid gap-4 space-y-2">
            <div>
              <Label htmlFor="new-stock">Position</Label>
              <Input
                id="position"
                placeholder="Enter position of the plant inside the batch "
              />
            </div>

            <div>
              <Label htmlFor="new-size">Health</Label>
              <ToggleGroup
                type="single"
                defaultValue="healthy"
                variant="outline"
              >
                <ToggleGroupItem value="healthy">Healthy</ToggleGroupItem>
                <ToggleGroupItem value="needs-nutrient-adjustment">
                  Needs Nutrient Adjustment
                </ToggleGroupItem>
                <ToggleGroupItem value="in-danger">
                  In Danger (Illness)
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </GenericSheet>
      </CardFooter>
    </Card>
  );
};

export { PlantsForm };
