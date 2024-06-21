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
  GetSaleDetailQueryData,
  getSaleById,
} from '@/modules/sales/data-access';
import { t } from 'i18next';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CreateSaleInput, SaleItem } from '@/modules/sales/data-access/schema';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { plants } from '@/modules/plants/data-access/schema';
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
import { useRouter } from 'next/navigation';

interface SaleItemsTableProps {
  saleItems: SaleItem;
  deleteItem: (item: CreateSaleInput) => void;
  plants: { id: string; name: string; price: number }[];
}

const SaleGeneralInfo = (props: SaleItemsTableProps) => {
  const params = useParams<{ id: string }>();
  const [sale, setSale] = useState<GetSaleDetailQueryData | undefined>(
    undefined,
  );
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
    ];
  };

  useEffect(() => {
    const fetchSale = async () => {
      console.log('fetch member with id ', params.id);
      const sale = await getSaleById(Number(params.id));
      setSale(sale);
    };

    fetchSale();
  }, []);

  if (!sale) return null;

  const table = useReactTable({
    data: saleItems,
    columns: getItemSalesTableColumns(router, props),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
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
};

export { SaleGeneralInfo };
