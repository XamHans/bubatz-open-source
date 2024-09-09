'use client'

import SkeletonLoader from '@/app/components/SkeletonLoader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { useToast } from '@/components/ui/use-toast'
import { BatchProps, PlantProps } from '@/modules/plants/data-access/schema'
import {
  deletePlantUseCase,
  fetchPlantsFromBatchUseCase,
} from '@/modules/plants/use-cases'
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
import { ArrowUpDown, Trash2 } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useState } from 'react'
import { UpdatePlantForm } from './UpdatePlant'

export interface PlantsTableProps {
  batch: BatchProps
}

const PlantsTable = ({ batch }: PlantsTableProps) => {
  const { toast } = useToast()

  const { execute, status } = useAction(fetchPlantsFromBatchUseCase, {
    onSuccess: ({ data }) => {
      setPlants((data?.success.plants as any) ?? [])
    },
    onError: (error) => {
      console.log('Error fetching plants', error)
    },
  })

  const { execute: delExecute, status: delStatus } = useAction(
    deletePlantUseCase,
    {
      onSuccess: (data) => {
        toast({
          title: 'Success',
          description: `Plant deleted successfully.`,
        })
        execute({ batchId: batch.id }) //re-fetch plants
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: `Plant  could not be deleted due to an error. ${error}`,
        })
      },
    },
  )

  const getPlantTableColumns = () => {
    const columns = [
      {
        id: 'position',
        accessorKey: 'position',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="justify-start text-xs"
          >
            Position
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="w-auto p-0 text-left">{row.original.position}</div>
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
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="ml-4 text-left">{row.getValue('name')}</div>
        ),
      },
      {
        id: 'health',
        accessorKey: 'health',
        header: ({ column }) => (
          <Button variant="ghost" className="justify-start text-xs">
            Health
          </Button>
        ),
        cell: ({ row }) => (
          <div className="ml-4 text-left">
            <Badge variant="outline">{row.getValue('health')}</Badge>
          </div>
        ),
      },
      {
        id: 'yield',
        accessorKey: 'yield',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="justify-start text-xs"
          >
            Yield
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="ml-4 w-4 p-0 text-left">
            {String(row.getValue('yield'))}g
          </div>
        ),
      },
      {
        id: 'actions',
        enableHiding: false,
        header: () => (
          <Button variant="ghost" className="justify-start text-xs">
            Actions
          </Button>
        ),
        cell: ({ row }) => {
          const plant = row.original
          return (
            <div className="flex justify-start">
              <Button
                variant="ghost"
                className="hover:bg-inherit"
                onClick={() => {}}
              >
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                      <UpdatePlantForm
                        plant={plant}
                        onClose={() => execute({ batchId: batch.id })}
                      />
                    </TooltipTrigger>
                    <TooltipContent align="end">Edit Plant</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Button>

              <Button
                variant="ghost"
                className="hover:bg-inherit"
                onClick={() => {
                  delExecute({ id: plant.id })
                }}
              >
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                      <Trash2 className="h-4 w-4 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent align="end">Delete Plant</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Button>
            </div>
          )
        },
      },
    ]

    return columns
  }

  const [plants, setPlants] = useState<PlantProps[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    execute({ batchId: batch.id })
  }, [])

  const table = useReactTable({
    data: plants,
    columns: getPlantTableColumns(),
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
        {status === 'hasSucceeded' && plants && (
          <>
            {table.getRowModel()?.rows?.length ? (
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
                <TableCell className="col-span-3 h-24 text-center">
                  No plants found in this batch.
                </TableCell>
              </TableRow>
            )}
          </>
        )}
      </TableBody>
    </Table>
  )
}

export { PlantsTable }
