"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "@/data/pagination";

import { Spinner } from "../../common/spinner";
import { useDictionary } from "../../layout/dictionary-provider";
import { DataTablePagination } from "../base/data-table-pagination";
import { DataTableToolbar } from "../base/data-table-toolbar";

interface DataGridProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  queryKey: Array<string>;
  queryFn: (params: any) => Promise<{ rows: TData[]; rowCount?: number }>;
  exportFn?: (params: any) => Promise<Blob>;
  exportFileName?: string;
  renderItem: (item: TData) => React.ReactNode;
  schema?: (data: TData) => TData;
  toolbar?: React.ReactNode | ((table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode);
}

export function ServerSideDataGrid<TData, TValue>({
  columns,
  queryKey,
  queryFn,
  exportFn,
  exportFileName,
  renderItem,
  schema,
  toolbar,
}: DataGridProps<TData, TValue>) {
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
        // filterQueries: columnFilters.length ? convertFilters(columnFilters) : undefined,
      }),
  });

  const { dict } = useDictionary();

  const table = useReactTable({
    data: (data as any)?.rows || [],
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    rowCount: (data as any)?.rowCount || 0,
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
        {/* <div>
          <DataTableViewOptions dict={dict} table={table} />
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
        {data?.rows?.length ? (
          data.rows.map((item, index) => (
            <React.Fragment key={index}>
              {schema ? renderItem(schema(item)) : renderItem(item)}
            </React.Fragment>
          ))
        ) : (
          <div className="col-span-full text-center text-sm">{dict?.Shared?.NoResults}</div>
        )}
      </div>
    </div>
  );
}
