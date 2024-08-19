'use client';

import SkeletonLoader from '@/app/components/SkeletonLoader';
import { siteConfig } from '@/config/site';
import { logger } from '@/lib/logger';
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
import { ArrowUpDown, ChevronLeft, ChevronRight, EyeIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../../components/ui/avatar';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip';
import { UserSchema } from '../../../../modules/members/data-access/schema';
import {
  ClubMemberStatus,
  colorForClubMemberStatus,
} from '../../../../modules/members/types';
import { fetchMembersUseCase } from '../../../../modules/members/use-cases';
import { AddMemberModal } from './AddMemberModal';
import { DeleteMemberModal } from './DeleteMemberModal';

export default function MemberTable() {
  const getUserTableColumns = (router: AppRouterInstance) => {
    return [
      {
        id: 'avatar',
        header: 'Image',
        cell: ({ row }) => (
          <Avatar className="h-12 w-12">
            <AvatarImage src={``} />
            <AvatarFallback>
              {(row.getValue('name') as string)?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
        ),
        enableSorting: false,
        enableHiding: false,
      },

      {
        accessorKey: 'name',
        accessorFn: (row) => {
          const fullName =
            `${row.firstName || ''} ${row.lastName || ''}`.trim();
          return fullName || row.email;
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
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="ml-4 text-left">
            {row.getValue('name') || (
              <span className="text-gray-400">No name (Email only)</span>
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
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const status = row.getValue('status') as ClubMemberStatus;
          const bgColor = colorForClubMemberStatus.get(status) || 'bg-gray-400';
          return (
            <Badge
              className={`bg-${bgColor} border-none	  text-gray-950/75 hover:text-gray-400`}
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        header: ({ column }) => {
          return (
            <Button variant="ghost" className="justify-center text-xs">
              Actions
            </Button>
          );
        },
        cell: ({ row }) => {
          const member = row.original;
          return (
            <div className="flex justify-start ">
              <Button
                variant="ghost"
                className="transition-transform duration-200 hover:bg-inherit"
                onClick={() => {
                  router.push(
                    siteConfig.links.members.detail.replace(':id', member.id!),
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
                        {t('member:ACTIONS.DETAIL')} Edit
                      </Badge>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="transition-transform duration-200 hover:bg-inherit"
              >
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                      <DeleteMemberModal
                        member={member}
                        setMembers={setMembers}
                      />
                    </TooltipTrigger>
                    <TooltipContent align="end">
                      <Badge className="bg-inherit text-black hover:bg-inherit">
                        {t('member:ACTIONS.DETAIL')} Delete
                      </Badge>
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

  const { execute, status } = useAction(fetchMembersUseCase, {
    onSuccess: ({ data }) => {
      setMembers(data?.success ?? []);
    },
    onError: (error) => {
      logger.error('Error fetching member', error);
    },
  });

  const [members, setMembers] = React.useState<UserSchema[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();

  useEffect(() => {
    execute();
  }, []);

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
  });

  if (status === 'executing') {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-4 ">
      <div className="flex items-center justify-between space-x-2">
        <Input
          placeholder={t('member:ACTIONS.SEARCH') ?? 'Search members'}
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <AddMemberModal setMembers={setMembers} />
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
  );
}
