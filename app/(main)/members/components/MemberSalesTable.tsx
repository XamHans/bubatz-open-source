'use client'

import SkeletonLoader from '@/app/components/SkeletonLoader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { siteConfig } from '@/config/site'
import { logger } from '@/lib/logger'
import { fetchMemberSalesUseCase } from '@/modules/sales/use-cases'
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
} from '@tanstack/react-table'
import { t } from 'i18next'
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import * as React from 'react'
import { useEffect, useState } from 'react'

interface MemberSalesTableProps {
  memberId: string
}

export default function MemberSalesTable({ memberId }: MemberSalesTableProps) {
  const getMemberSalesTableColumns = () => {
    return [
      {
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
        cell: ({ row }) => <div>{row.getValue('strainName')}</div>,
      },
      {
        accessorKey: 'price',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="justify-start text-xs"
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue('price')} €</div>,
      },
      {
        accessorKey: 'quantity',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="justify-start text-xs"
          >
            Quantity (g)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue('quantity')} g</div>,
      },
      {
        accessorKey: 'adminName',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="justify-start text-xs"
          >
            Sold By
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue('adminName')}</div>,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="justify-start text-xs"
          >
            Sale Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>{new Date(row.getValue('createdAt')).toLocaleString()}</div>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const sale = row.original
          return (
            <div className="flex items-center space-x-2">
              <Link
                href={siteConfig.links.sales.detail.replace(':id', sale.id)}
              >
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )
        },
      },
    ]
  }

  const { execute, status } = useAction(fetchMemberSalesUseCase, {
    onSuccess: (data) => {
      console.info('Fetched member sales', data)
      setSales(data.data?.success ?? [])
    },
    onError: (error) => {
      logger.error('Error fetching member sales', error)
    },
  })

  const [sales, setSales] = React.useState<any[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    execute({ memberId })
  }, [memberId])

  const table = useReactTable({
    data: sales,
    columns: getMemberSalesTableColumns(),
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
  })

  if (status === 'executing') {
    return <SkeletonLoader />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <Input
          placeholder={t('sales:ACTIONS.SEARCH') ?? 'Search sales'}
          value={
            (table.getColumn('strainName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('strainName')?.setFilterValue(event.target.value)
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
                  colSpan={getMemberSalesTableColumns().length}
                  className="h-24 text-center"
                >
                  {t('GENERAL.DATA_TABLE.NO_RESULTS', {
                    entity: t('sales:TITLE'),
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
  )
}
