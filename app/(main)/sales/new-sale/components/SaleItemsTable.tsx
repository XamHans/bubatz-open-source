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

interface SaleItemsTableProps {
  saleItems: SaleItem[];
  deleteItem: (item: SaleItem) => void;
  plants: { id: number; name: string; price: number }[];
}

export default function SaleItemsTable(props: SaleItemsTableProps) {
  const { saleItems, deleteItem, plants } = props;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();

  const getItemSalesTableColumns = (
    router: AppRouterInstance,
    { deleteItem, plants }: Omit<SaleItemsTableProps, 'saleItems'>,
  ) => {
    return [
      {
        id: 'plantId',
        header: 'Plant',
        cell: ({ row }) => (
          <div className="capitalize">
            {plants.find((plant) => plant.id === row.original.plantId)?.name}
          </div>
        ),
      },
      {
        id: 'weightGrams',
        header: 'Grams',
        cell: ({ row }) => (
          <div className="capitalize">{row.original.weightGrams} grams</div>
        ),
      },
      {
        id: 'price',
        header: 'Current Price',
        cell: ({ row }) => (
          <div className="capitalize">{row.original.price} €</div>
        ),
      },
      {
        id: 'totalPrice',
        header: 'Total Price',
        cell: ({ row }) => (
          <div className="capitalize">
            {row.original.price * row.original.weightGrams} €
          </div>
        ),
      },
      {
        id: 'actions',
        enableHiding: false,
        header: 'Actions',
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
                    <TooltipContent align="end">
                      <Badge> Delete item </Badge>
                    </TooltipContent>
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
    columns: getItemSalesTableColumns(router, props),
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
    <div className="">
      <div className="rounded-md border">
        <Table className="rounded-md bg-white">
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
                    <TableCell className="mx-auto" key={cell.id}>
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
                <TableCell className="h-24 text-center">
                  {t('GENERAL.DATA_TABLE.NO_RESULTS', {
                    entity: t('member:TITLE'),
                  })}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
