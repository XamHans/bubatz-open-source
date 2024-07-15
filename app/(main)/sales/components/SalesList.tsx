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
import { SaleWithoutItems } from '@/modules/sales/data-access/schema';
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
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpDown,
  EyeIcon,
} from 'lucide-react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { fetchMembersUseCase } from '@/modules/members/use-cases';
import { fetchSalesUseCase } from '@/modules/sales/use-cases';
import { UserSchema } from '@/modules/members/data-access/schema';

type SaleTableData = SaleWithoutItems & { userName: string };

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
            className="text-s justify-start font-semibold"
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
        return <div className="capitalize">{row.totalPrice}</div>;
      },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-s justify-start font-semibold"
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
            className="text-s justify-start font-semibold"
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
      accessorKey: 'userName',
      accessorFn: (row) => {
        return row.userName;
      },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-s justify-start font-semibold"
          >
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="capitalize">{row.getValue('userName')}</div>;
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
            className="text-s justify-start font-semibold"
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
          <div className="flex justify-center font-semibold">
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
                      {t('member:ACTIONS.DETAIL')} Details
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

export default function SalesTable() {
  // const { members, sales, isFetching } = React.useContext(SalesContext);

  const [members, setMembers] = useState<UserSchema[]>();
  const [sales, setSales] = useState<SaleWithoutItems[]>();
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const [parsedSalesData, setParsedSalesData] = useState<SaleTableData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();

  const table = useReactTable({
    data: parsedSalesData,
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

  // ------ Use cases -----
  const fetchMembers = useAction(fetchMembersUseCase, {
    onSuccess: (data) => {
      // Sort members by full name
      data.members.sort((a, b) => {
        return a.fullName.localeCompare(b.fullName);
      });
      setMembers((prev) => data.members);
    },
  });

  const fetchSales = useAction(fetchSalesUseCase, {
    onSuccess: (data) => {
      setSales(() => data.sales);
    },
  });

  // ------------------- Effects -------------------

  useEffect(() => {
    if (!members || !sales) return;

    const parsedData = sales.map((sale) => {
      const member = members.find((member) => member.id == sale.userId);
      console.log('member', member);
      return {
        ...sale,
        userName: member?.firstName + ' ' + member?.lastName,
      };
    });
    setParsedSalesData(() => parsedData);
    setIsFetching(() => false);
  }, [members, sales]);

  // Fetch necessary data
  useEffect(() => {
    fetchMembers.execute({});
    fetchSales.execute({});
  }, []);

  // ------------------- Render -------------------

  //  const {t} = await initializeI18nClient('en')

  return (
    <div className="space-y-4 ">
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
                  <TableCell className="text-left " key={cell.id}>
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
            {t('GENERAL.PAGINATION.PREVIOUS')} <ArrowLeftIcon />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t('GENERAL.PAGINATION.NEXT')} <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
