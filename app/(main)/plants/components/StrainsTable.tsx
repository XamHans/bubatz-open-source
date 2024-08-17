'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { fetchStrainsUseCase } from '@/modules/plants/use-cases';
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

const getStrainsTableColumns = (router: AppRouterInstance) => {
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
          Strain ID
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
          Strain Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-4 text-left">{row.getValue('name')}</div>
      ),
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="justify-start text-xs"
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge className="ml-4" variant="outline">
          {row.getValue('type')}
        </Badge>
      ),
    },
    {
      id: 'thcContent',
      accessorKey: 'thcContent',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="justify-start text-xs"
        >
          THC Content
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-4 text-left">{row.getValue('thcContent')}%</div>
      ),
    },
    {
      id: 'cbdContent',
      accessorKey: 'cbdContent',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="justify-start text-xs"
        >
          CBD Content
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-4 text-left">{row.getValue('cbdContent')}%</div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const strain = row.original;
        return (
          <div className="flex justify-start">
            <Button
              variant="ghost"
              className="hover:bg-inherit"
              onClick={() => {
                router.push(
                  siteConfig.links.plants.strainDetail.replace(':id', strain.id),
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

export default function StrainsTable() {
  const { execute, status } = useAction(fetchStrainsUseCase, {
    onSuccess: (data) => {
      setStrains(data?.data?.success ?? []);
    },
    onError: (error) => {
      console.log('Error fetching strains', error);
    },
  });

  const [strains, setStrains] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();

  useEffect(() => {
    execute(undefined);
  }, [execute]);

  const table = useReactTable({
    data: strains,
    columns: getStrainsTableColumns(router),
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

  return (
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
            <TableCell className="h-24 text-center">
              {t('GENERAL.DATA_TABLE.NO_RESULTS', {
                entity: t('plants:STRAINS'),
              })}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
