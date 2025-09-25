/**
 * This component was initially created following the tutorial at:
 * https://ui.shadcn.com/docs/components/data-table
 */
"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { TableRequest } from "@/types/search-and-filter";

import { DataTablePagination } from "../base/data-table-pagination";
import { DataTableRowActions } from "../base/data-table-row-actions";
import { DataTableToolbar } from "../base/data-table-toolbar";
import { DataTableViewOptions } from "../base/data-table-view-options";

interface DataTableProps<TData, TValue> {
  dict: any;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowActions?: Array<{
    label: string;
    onClick: (row: TData) => void;
    shortcut?: string;
  }>;
  schema?: (data: TData) => TData;
  toolbar?: React.ReactNode | ((table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode);
  exportFn: (request: TableRequest) => Promise<Blob>;
  exportFileName: string;
}

export function ClientSideDataTable<TData, TValue>({
  dict,
  columns,
  data,
  rowActions = [],
  schema,
  toolbar,
  exportFn,
  exportFileName,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

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
