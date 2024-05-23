'use client';

import configuration from '@/app/configuration';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
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
import { getMembers } from '@/modules/members/data-access';
import { MemberProps, colorForClubMemberStatus } from '@/modules/members/types';
import { useQuery } from '@tanstack/react-query';
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
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';
import { AddMemberModal } from './AddMemberModal';

const getUserTableColumns = (router: AppRouterInstance) => {
  const handleDelete = async (confirmed: boolean, member: MemberProps) => {
    if (confirmed) {
      if (!member.id) throw Error('No member id available');
    }
  };

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'avatar',
      header: 'Image',
      cell: ({ row }) => (
        // <Checkbox
        //   checked={row.getIsSelected()}
        //   onCheckedChange={(value) => row.toggleSelected(!!value)}
        //   aria-label="Select row"
        // />
        <Avatar className="h-12 w-12 ">
          <AvatarImage src={``} />
          <AvatarFallback>
            {' '}
            {(row.getValue('name') as string).charAt(0)}
          </AvatarFallback>
        </Avatar>
      ),
      enableSorting: false,
      enableHiding: false,
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
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`${colorForClubMemberStatus.get(row.getValue('status'))}`}
        >
          ${row.getValue('status')}
        </Badge>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const member = row.original;
        return (
          <div className="flex justify-center ">
            <Button
              variant="ghost"
              className="hover:bg-inherit"
              onClick={() => {
                // router.push(configuration.paths.MEMBER_DETAIL.replace(":id", member:id!))
                router.push(
                  configuration.paths.members.detail.replace(':id', member.id!),
                );
              }}
            >
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <EyeIcon className="h-6 w-6 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent align="end">
                    <Badge> {t('member:ACTIONS.DETAIL')}</Badge>
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
  const {
    data,
    error: getMemberError,
    fetchStatus,
  } = useQuery({
    queryFn: async () => getMembers(),
    queryKey: ['members'],
  });
  const [members, setMembers] = React.useState<MemberProps[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();

  React.useEffect(() => {
    if (data) {
      console.log('MEMBERS TABLE MEMBER RESULT: ', data);
      setMembers(data);
    }
  }, [fetchStatus, getMemberError]);

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

  //  const {t} = await initializeI18nClient('en')

  return (
    <div className="space-y-4 ">
      <div className="flex items-center space-x-2">
        <Input
          placeholder={t('member:ACTIONS.SEARCH') ?? ''}
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <AddMemberModal />
      </div>
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
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('GENERAL.PAGINATION.PREVIOUS')}
          </Button>
          <Button
            variant="outline"
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
