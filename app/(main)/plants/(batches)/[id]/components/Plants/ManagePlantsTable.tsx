'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlantDetailsData } from '@/modules/plants/data-access';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Save, Trash2 } from 'lucide-react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface PlantTableProps {
  plants: PlantDetailsData[];
  isLoading: boolean;
}

const ManagePlantsTable: React.FC<PlantTableProps> = ({
  plants,
  isLoading,
}) => {
  // Instantiate the form hook.
  const { register, handleSubmit, control, clearErrors, watch } = useForm<any>({
    defaultValues: {
      table: plants,
    },
  });

  const columns: ColumnDef<PlantDetailsData>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        return (
          <Input
            {...register(`table.${row.index}.name`, {
              required: 'Required',
            })}
            placeholder="Plant Name"
          />
        );
      },
    },
    {
      accessorKey: 'position',
      header: 'Position',
      cell: ({ row }) => {
        return (
          <Input
            {...register(`table.${row.index}.position`, {
              required: 'Required',
            })}
            placeholder="Plant Position"
          />
        );
      },
    },

    // Here is where you can add a button to submit an individual row.
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <>
            <div className="flex space-x-2">
              {' '}
              <Button
                className="ghost"
                type="submit"
                small
                onClick={handleSubmit((data) => {
                  onSubmitSingle(data.table[row.index]);
                  toast('Event has been created', {
                    description: 'Sunday, December 03, 2023 at 9:00 AM',
                    action: {
                      label: 'Undo',
                      onClick: () => console.log('Undo'),
                    },
                  });
                })}
              >
                <Save size={18} />
              </Button>
              <Button className="ghost" small onClick={() => remove(row.index)}>
                <Trash2 size={18} />
              </Button>
            </div>
          </>
        );
      },
    },
  ];

  const { fields, remove } = useFieldArray({
    name: 'table',
    control,
  });

  // Instantiate the table instance and pass in the field array directly into the table.
  const table = useReactTable({
    data: fields,
    columns,
    getCoreRowModel: getCoreRowModel(),
    rowCount: plants.length || 0,
    pageCount: 1,
    getRowId: (row) => row.id,
  });

  // Submit handlers
  const onSubmitSingle = (data: any) => {
    console.log(data);
  };

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </form>
    </>
  );
};

export { ManagePlantsTable };
