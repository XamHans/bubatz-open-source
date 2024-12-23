'use client'

import SkeletonLoader from '@/app/components/SkeletonLoader'
import { siteConfig } from '@/config/site'
import { Pencil1Icon } from '@radix-ui/react-icons'
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
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  EyeIcon,
  PlusCircle,
  ShieldIcon,
  UserIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useAction } from 'next-safe-action/hooks'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import { UserSchema } from '../../../../modules/members/data-access/schema'
import {
  ClubMemberStatus,
  colorForClubMemberStatus,
} from '../../../../modules/members/types'
import { fetchMembersUseCase } from '../../../../modules/members/use-cases'

export default function MemberTable() {
  const t = useTranslations('')

  const getUserTableColumns = (router: AppRouterInstance) => {
    return [
      {
        id: 'role',
        header: t('General.form.labels.role'),
        cell: ({ row }) => {
          const isAdmin = row.original.role === 'ADMIN'
          return (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  {isAdmin ? (
                    <ShieldIcon className="h-6 w-6 text-blue-500" />
                  ) : (
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isAdmin
                      ? t('General.form.options.role.admin')
                      : t('General.form.options.role.member')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        accessorFn: (row) => {
          const fullName = `${row.firstName || ''} ${row.lastName || ''}`.trim()
          return fullName || row.email
        },
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="justify-start text-xs"
            >
              {t('General.form.labels.firstName')}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => (
          <div className="ml-4 text-left">
            {row.getValue('name') || (
              <span className="text-gray-400">{row.original.email}</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="justify-start text-xs"
            >
              {t('General.form.labels.status')}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const status = row.getValue('status') as ClubMemberStatus
          const bgColor = colorForClubMemberStatus.get(status) || 'bg-gray-400'
          return (
            <Badge
              className={`bg-${bgColor} border-none	  text-gray-950/75 hover:text-gray-400`}
            >
              {t(`General.form.status.${status}`)}
            </Badge>
          )
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        header: ({ column }) => {
          return (
            <Button variant="ghost" className="justify-center text-xs">
              {t('General.form.actions.save')}
            </Button>
          )
        },
        cell: ({ row }) => {
          const member = row.original
          return (
            <div className="flex justify-start ">
              <Button
                variant="ghost"
                className="transition-transform duration-200 hover:bg-inherit"
                onClick={() => {
                  router.push(
                    siteConfig.links.members.detail.replace(':id', member.id!),
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
                        {t('General.breadcrumbs.memberDetails')}
                      </Badge>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Button>

              <Button
                variant="ghost"
                className="transition-transform duration-200 hover:bg-inherit"
                onClick={() => {
                  router.push(
                    siteConfig.links.members.edit.replace(':id', member.id!),
                  )
                }}
              >
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                      <Pencil1Icon className="h-6 w-6 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent align="end">
                      <Badge className="bg-inherit text-black hover:bg-inherit">
                        {t('General.form.actions.edit')}
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
  }

  const { execute, status } = useAction(fetchMembersUseCase, {
    onSuccess: ({ data }) => {
      setMembers(data?.success ?? [])
    },
    onError: (error) => {
      console.error('Error fetching member', error)
    },
  })

  const [members, setMembers] = React.useState<UserSchema[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const router = useRouter()

  useEffect(() => {
    execute({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const table = useReactTable({
    data: members,
    columns: getUserTableColumns(router),
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
    <div className="space-y-4 ">
      <div className="flex items-center justify-between space-x-2">
        <Input
          placeholder={t('Members.actions.search')}
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Link href={siteConfig.links.members.new}>
          <Button className="w-38 h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {t('Members.actions.new')}
            </span>
          </Button>
        </Link>
      </div>
      <div>
        <Table className="rounded-md bg-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
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
                  )
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
                  {t('General.dataTable.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
