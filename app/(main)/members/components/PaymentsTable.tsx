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
import { logger } from '@/lib/logger';
import { MembershipPaymentSchema } from '@/modules/members/data-access/schema';
import { fetchMemberPaymentsUseCase } from '@/modules/members/use-cases';
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
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye, Pencil } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

interface PaymentTableProps {
  memberId: string;
}

export default function PaymentTable({ memberId }: PaymentTableProps) {
  const getPaymentTableColumns = () => {
    return [
      {
        accessorKey: 'year',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="justify-start text-xs"
          >
            Year
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue('year')}</div>,
      },
      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="justify-start text-xs"
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue('amount')} €</div>,
      },
      {
        accessorKey: 'paymentDate',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="justify-start text-xs"
          >
            Payment Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue('paymentDate')}</div>,
      },
      {
        accessorKey: 'paymentStatus',
        header: 'Status',
        cell: ({ row }) => <Badge>{row.getValue('paymentStatus')}</Badge>,
      },
      {
        accessorKey: 'paymentMethod',
        header: 'Method',
        cell: ({ row }) => <div>{row.getValue('paymentMethod')}</div>,
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const payment = row.original;
          return (
            <div className="flex items-center space-x-2">
              <Link href={`${siteConfig.links.members.detail.replace(':id', memberId)}/payments/${payment.id}`}>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`${siteConfig.links.members.detail.replace(':id', memberId)}/payments/${payment.id}/edit`}>
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          );
        },
      },
    ];
  };

  const { execute, status } = useAction(fetchMemberPaymentsUseCase, {
    onSuccess: (data) => {
      setPayments(data.data?.success ?? []);
    },
    onError: (error) => {
      logger.error('Error fetching member payments', error);
    },
  });

  const [payments, setPayments] = React.useState<MembershipPaymentSchema[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    execute({ memberId });
  }, [memberId]);

  const table = useReactTable({
    data: payments,
    columns: getPaymentTableColumns(),
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
          placeholder={t('payment:ACTIONS.SEARCH') ?? 'Search payments'}
          value={(table.getColumn('year')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('year')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-left" key={cell.id}>
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
                  colSpan={getPaymentTableColumns().length}
                  className="h-24 text-center"
                >
                  {t('GENERAL.DATA_TABLE.NO_RESULTS', {
                    entity: t('payment:TITLE'),
                  })}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
