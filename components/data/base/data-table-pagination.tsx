"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";

import { useDictionary } from "../../layout/dictionary-provider";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const { dict } = useDictionary();

  return (
    <div className="flex items-center justify-between px-2 flex-wrap gap-y-3 gap-x-5">
      <div className="flex-1 text-sm text-muted-foreground">
        {/* {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <>
            {table.getFilteredSelectedRowModel().rows.length} {dict?.DataTable?.of}{" "}
            {table.getFilteredRowModel().rows.length} {dict?.DataTable?.ItemsSelected}.
          </>
        ) : (
          <></>
        )} */}
      </div>

      <div className="flex items-center gap-x-6 lg:space-x-0 flex-wrap gap-y-3">
        <div className="flex items-center space-x-2">
          {/* <p className="text-sm font-medium">{dict?.DataTable?.ItemsPerPage}</p> */}
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-auto gap-2 border-none px-0">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[40, 80].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize} {dict?.DataTable?.Results}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {table.getPageCount() > 0 && (
          <div className="flex items-center justify-center text-sm font-medium">
            {dict?.DataTable?.Page} {table.getState().pagination.pageIndex + 1}{" "}
            {dict?.DataTable?.of} {table.getPageCount()}
          </div>
        )}
        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{dict?.DataTable?.GoToFirstPage}</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{dict?.DataTable?.GoToPreviousPage}</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{dict?.DataTable?.GoToNextPage}</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{dict?.DataTable?.GoToLastPage}</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
