'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { t } from 'i18next';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';
// import {
//   selectUser,
//   selectUserSchema,
// } from '@/modules/members/data-access/schema';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { EyeIcon, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SaleItem } from '@/modules/sales/data-access/schema';
import { StrainProps } from '@/modules/plants/data-access/schema';

interface SaleItemsTableProps {
  saleItems: SaleItem[];
  deleteItem: (item: SaleItem) => void;
  strains: StrainProps[];
}

export default function SaleItemsTable(props: SaleItemsTableProps) {
  const { saleItems, deleteItem, strains } = props;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();

  const getItemSalesTableColumns = (router: AppRouterInstance) => {
    return [
      {
        accessorKey: 'strainId',
        accessorFn: (item: SaleItem) => item.strainId,
        header: (
          <div className="text-s justify-start font-semibold">STRAIN</div>
        ),
        cell: ({ row }) => (
          <div className="text-s justify-start">
            {
              strains.find((plant) => plant.id == row.getValue('strainId'))
                ?.name
            }
          </div>
        ),
      },
      {
        accessorKey: 'weightGrams',
        accessorFn: (item: SaleItem) => item.weightGrams,
        header: (
          <div className="text-s justify-start font-semibold">WEIGHT</div>
        ),
        cell: ({ row }) => (
          <div className="text-s justify-start">
            {row.original.weightGrams} grams
          </div>
        ),
      },
      {
        accessorKey: 'price',
        accessorFn: (item: SaleItem) => item.price,
        header: (
          <div className="text-s justify-start font-semibold">GRAM PRICE</div>
        ),
        cell: ({ row }) => (
          <div className="text-s justify-start">{row.original.price} €</div>
        ),
      },
      {
        accessorKey: 'totalPrice',
        accessorFn: (item: SaleItem) => item.price * item.weightGrams,
        header: (
          <div className="text-s justify-start font-semibold">TOTAL PRICE</div>
        ),
        cell: ({ row }) => (
          <div className="text-s justify-start">
            {row.original.price * row.original.weightGrams} €
          </div>
        ),
      },
      {
        id: 'actions',
        header: (
          <div className="text-s justify-start font-semibold">ACTIONS</div>
        ),
        cell: ({ row }) => {
          const item: SaleItem = row.original;
          return (
            <div className=" ">
              <Button
                variant="ghost"
                className="hover:bg-inherit"
                onClick={() => {
                  deleteItem(item);
                }}
              >
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                      <Trash className="h-6 w-6 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent align="end">Delete item</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Button>
            </div>
          );
        },
      },
    ];
  };

  const table = useReactTable({
    data: saleItems,
    columns: getItemSalesTableColumns(router),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
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

  // React.useEffect(() => {
  //   if (saleItemsDisplayData.length === 0) return;
  //   addSaleItemToSale(saleItemsDisplayData[saleItemsDisplayData.length - 1]);
  // }, [saleItemsDisplayData]);

  // const addItem = (item: SaleItem) => {
  //   setSaleItemsDisplayData((prev) => [...prev, item]);
  // };

  //  const {t} = await initializeI18nClient('en')

  return (
    <Table className="rounded-md bg-white">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className="text-s text-left sm:table-cell"
                >
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
                entity: t('member:TITLE'),
              })}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
