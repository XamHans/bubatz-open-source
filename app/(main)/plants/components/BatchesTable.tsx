'use client';

import SkeletonLoader from '@/app/components/SkeletonLoader';
import { Badge } from '@/components/ui/badge';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { siteConfig } from '@/config/site';
import { fetchBatchesUseCase } from '@/modules/plants/use-cases';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { t } from 'i18next';
import { ArrowUpDown, EyeIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const getBatchtesTableColumns = (router: AppRouterInstance) => {
  return [
    {
      id: 'id',
      accessorKey: 'id',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="justify-start text-xs"
        >
          Batch ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-4 text-left">
          {String(row.getValue('id')).slice(-6)}
        </div>
      ),
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="justify-start text-xs"
        >
          Batch Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-4 text-left">{row.getValue('name')}</div>
      ),
    },
    {
      id: 'strain',
      accessorKey: 'strainName',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="justify-start text-xs"
        >
          Strain
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge className="ml-4" variant="outline">
          {row.original.strainName}
        </Badge>
      ),
    },
    {
      id: 'startDate',
      accessorKey: 'startDate',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="justify-start text-xs"
        >
          Start Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-lef ml-4">
          {new Date(row.getValue('startDate')).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: 'currentGrowthStage',
      accessorKey: 'currentGrowthStage',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="justify-start text-xs"
        >
          Current Growth Stage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-4 text-left">
          <Badge variant="outline">{row.original.currentGrowPhase}</Badge>
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex justify-start">
            <Button
              variant="ghost"
              className="hover:bg-inherit"
              onClick={() => {
                router.push(
                  siteConfig.links.plants.batches.detail.replace(
                    ':id',
                    row.original.id,
                  ),
                );
              }}
            >
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <EyeIcon className="h-6 w-6 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent align="end">Zur Detail Seite</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Button>
          </div>
        );
      },
    },
  ];
};

export default function BatchesTable() {
  const { execute, status } = useAction(fetchBatchesUseCase, {
    onSuccess: ({ data }) => {
      setPlants(data?.success ?? []);
    },
    onError: (error) => {
      console.log('Error fetching plants', error);
    },
  });

  const [plants, setPlants] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();

  useEffect(() => {
    execute(undefined);
  }, [execute]);

  const table = useReactTable({
    data: plants,
    columns: getBatchtesTableColumns(router),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (status === 'executing') {
    return <SkeletonLoader />; // This will use the default table skeleton
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <Input
          placeholder={t('plants:ACTIONS.SEARCH') ?? 'Search batches'}
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <Table className="rounded-md bg-white">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-left text-xs sm:table-cell"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table?.getRowModel()?.rows?.length ? (
            table?.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="text-left" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={getBatchtesTableColumns(router).length}
                className="h-24 text-center"
              >
                {t('GENERAL.DATA_TABLE.NO_RESULTS', {
                  entity: t('plants:TITLE'),
                })}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
