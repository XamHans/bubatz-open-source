'use client';

import configuration from '@/app/configuration';
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
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { getMemberDetail } from '@/modules/members/data-access';
import { UserSchema } from '@/modules/members/data-access/schema';
import { MemberProps } from '@/modules/members/types';
import { SaleWithoutItems } from '@/modules/sales/data-access/schema';
import { fetchSalesUseCase } from '@/modules/sales/use-cases';
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
import * as React from 'react';
import { useState } from 'react';

const getSaleTableColumns = (router: AppRouterInstance) => {
  return [
    {
      accessorKey: 'id',
      accessorFn: (row) => {
        return row.id;
      },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>,
    },

    {
      accessorKey: 'totalPrice',
      accessorFn: (row) => {
        return row.totalPrice;
      },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Total price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('totalPrice')}</div>
      ),
    },
    {
      accessorKey: 'paidVia',
      accessorFn: (row) => {
        return row.paidVia;
      },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Paid via
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="capitalize">{row.getValue('paidVia')}</div>;
      },
    },
    {
      accessorKey: 'name',
      accessorFn: (row) => {
        return row.firstName + ' ' + row.lastName;
      },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="capitalize">{row.getValue('name')}</div>;
      },
    },
    {
      accessorKey: 'createdAt',
      accessorFn: (row) => {
        return row.createdAt;
      },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="capitalize">{row.getValue('createdAt')}</div>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const sale = row.original;
        return (
          <div className="flex justify-center ">
            <Button
              variant="ghost"
              className="transition-transform duration-200 hover:bg-inherit"
              onClick={() => {
                router.push(
                  configuration.paths.sales.detail.replace(':id', sale.id!),
                );
              }}
            >
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <EyeIcon className="h-6 w-6 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent align="end">
                    <Badge className="bg-inherit text-black hover:bg-inherit">
                      {' '}
                      {t('member:ACTIONS.DETAIL')} Edit
                    </Badge>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Button>

            {/* <EditMemberModal member={member} />
            <DeleteModal<MemberProps>
              entity={member}
              onDelete={handleDelete}
              deleteConfirmationHeader={t("member:ACTIONS.DELETE")}
              deleteConfirmationText={t("member:ACTIONS.DELETE_TEXT")}
            />{" "} */}
          </div>
        );
      },
    },
  ];
};

export default function MemberTable() {
  const [sales, setSales] = React.useState<SaleWithoutItems[]>([]);
  const [users, setUsers] = React.useState<UserSchema[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();

  const table = useReactTable({
    data: sales,
    columns: getSaleTableColumns(router),
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

  const fetchSales = useAction(fetchSalesUseCase, {
    onSuccess: (data) => {
      setSales(data.sales);
    },
  });

  React.useEffect(() => {
    fetchSales.execute({});
  }, []);

  //  const {t} = await initializeI18nClient('en')

  return (
    <div className="space-y-4 ">
      {/* <div className="flex items-center space-x-2">
        <Input
          placeholder={t('member:ACTIONS.SEARCH') ?? ''}
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div> */}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
        <div className="space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('GENERAL.PAGINATION.PREVIOUS')}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t('GENERAL.PAGINATION.NEXT')}
          </Button>
        </div>
      </div>
    </div>
  );
}
