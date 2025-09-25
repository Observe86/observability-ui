/**
 * This component was initially created following the tutorial at:
 * https://ui.shadcn.com/docs/components/data-table
 *
 * It was then modified to be more generic and then made server-side pagination, filtering, etc. compatible,
 * instead of client-side (which has all the data on the client side and does the filtering, sorting, etc. there).
 * See https://tanstack.com/table/latest/docs/guide/pagination as one of the references used to make the changes.
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/data/pagination";

import { Spinner } from "../../common/spinner";
import { useDictionary } from "../../layout/dictionary-provider";
import { DataTablePagination } from "../base/data-table-pagination";
import { DataTableRowActions } from "../base/data-table-row-actions";
import { DataTableToolbar } from "../base/data-table-toolbar";
import { DataTableViewOptions } from "../base/data-table-view-options";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  queryKey: Array<string>;
  queryFn: (params: any) => Promise<{ rows: TData[]; rowCount?: number }>;
  exportFn?: (params: any) => Promise<Blob>;
  exportFileName?: string;
  rowActions?: Array<{
    label: string;
    onClick: (row: TData) => void;
    icon?: React.ReactNode;
    shortcut?: string;
  }>;
  schema?: (data: TData) => TData;
  toolbar?: React.ReactNode | ((table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode);
}

export function ServerSideDataTable<TData, TValue>({
  columns,
  queryKey,
  queryFn,
  exportFn,
  exportFileName,
  rowActions = [],
  schema,
  toolbar,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { data, isLoading } = useQuery({
    queryKey: [...queryKey, pagination.pageIndex, pagination.pageSize, sorting, columnFilters],
    queryFn: () =>
      queryFn({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        returnCount: true,
        orderBy: sorting.length ? sorting[0].id : undefined,
        orderDirection: sorting.length ? (sorting[0].desc ? "desc" : "asc") : undefined,
        // filterQueries: columnFilters.length ? convertFilters(columnFilters) : undefined,
      }),
  });

  const { dict } = useDictionary();

  const table = useReactTable({
    data: (data as any)?.rows || [],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (newPagination) => {
      setPagination(newPagination);
      setRowSelection({});
    },
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => (row as any).id,
    // getFilteredRowModel: getFilteredRowModel(),
    manualFiltering: true, // turn off client-side filtering
    // getPaginationRowModel: getPaginationRowModel(), // not needed for server-side pagination
    manualPagination: true, // turn off client-side pagination
    rowCount: (data as any)?.rowCount || 0,
    // pageCount: pageCount, // no need to set it as it's calculated automatically
    // autoResetPageIndex: true,
    // getSortedRowModel: getSortedRowModel(),
    manualSorting: true, // turn off client-side sorting
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-end">
        <DataTableToolbar
          table={table}
          toolbar={toolbar}
          exportFn={exportFn}
          exportFileName={exportFileName}
          showResetButton
        />
        <DataTablePagination table={table} />
        <div>
          <DataTableViewOptions dict={dict} table={table} />
        </div>
      </div>

      <div className="rounded-md border-none">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
                  data-state={row.getIsSelected() && "selected"}
                  className="border-none"
                >
                  {/* Normal Columns */}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}

                  {/* Actions Column */}
                  {rowActions.length > 0 && (
                    <TableCell>
                      <DataTableRowActions row={row} actions={rowActions} schema={schema} />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  {dict?.Shared?.NoResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
