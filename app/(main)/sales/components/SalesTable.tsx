'use client'

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
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  EyeIcon,
} from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import React, { useEffect, useState } from 'react'

import SkeletonLoader from '@/app/components/SkeletonLoader'
import { Badge } from '@/components/ui/badge'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { siteConfig } from '@/config/site'
import { logger } from '@/lib/logger'
import { fetchAllSalesUseCase } from '@/modules/sales/use-cases'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'

export default function SalesTable() {
  const [sales, setSales] = useState<any[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const { execute, status } = useAction(fetchAllSalesUseCase, {
    onSuccess: (data) => {
      console.info('Fetched sales', data)
      setSales(data.data?.success ?? [])
    },
    onError: (error) => {
      logger.error('Error fetching sales', error)
    },
  })

  useEffect(() => {
    execute()
  }, [])

  const toggleRowExpanded = (rowId: string) => {
    setExpandedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }))
  }

  const getSalesTableColumns = (router: AppRouterInstance) => [
    {
      id: 'expander',
      header: () => null,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          onClick={() => toggleRowExpanded(row.id)}
          className="h-8 w-8 p-0"
        >
          {expandedRows[row.id] ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      ),
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="justify-start text-xs"
        >
          Sales ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="w-[25px] truncate">{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: 'totalPrice',
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
      cell: ({ row }) => <div>{row.getValue('totalPrice')} €</div>,
    },
    {
      accessorKey: 'memberName',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="justify-start text-xs"
        >
          Member Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue('memberName')}</div>,
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
      enableHiding: false,
      header: ({ column }) => {
        return (
          <Button variant="ghost" className="justify-center text-xs">
            Actions
          </Button>
        )
      },
      cell: ({ row }) => {
        const sale = row.original
        return (
          <div className="flex justify-start ">
            <Button
              variant="ghost"
              className="transition-transform duration-200 hover:bg-inherit"
              onClick={() => {
                router.push(
                  siteConfig.links.sales.detail.replace(':id', sale.id!),
                )
              }}
            >
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <EyeIcon className="h-6 w-6 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent align="end">
                    <Badge className="bg-inherit text-black hover:bg-inherit">
                      {t('member:ACTIONS.DETAIL')} Detail
                    </Badge>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Button>
          </div>
        )
      },
    },
  ]

  const renderSaleItems = (items: any[], totalPrice: number) => {
    let sumTotal = 0

    return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Strain</TableHead>
              <TableHead>Weight (g)</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => {
              const subtotal = item.amount * item.price
              sumTotal += subtotal
              return (
                <TableRow key={index}>
                  <TableCell>{item.strainName}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.price.toFixed(2)} €</TableCell>
                  <TableCell>{subtotal.toFixed(2)} €</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="text-right">
          <span className="font-semibold">Total: {sumTotal.toFixed(2)} €</span>
        </div>
      </div>
    )
  }

  const router = useRouter()

  const table = useReactTable({
    data: sales,
    columns: getSalesTableColumns(router),
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
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
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
            (table.getColumn('memberName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('memberName')?.setFilterValue(event.target.value)
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
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="text-left" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandedRows[row.id] && (
                    <TableRow>
                      <TableCell colSpan={getSalesTableColumns(router).length}>
                        <div className="rounded-md bg-gray-50 p-4">
                          {renderSaleItems(
                            row.original.items,
                            row.original.totalPrice,
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={getSalesTableColumns(router).length}
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
