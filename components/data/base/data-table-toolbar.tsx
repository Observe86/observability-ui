"use client";

import { useMutation } from "@tanstack/react-query";
import { Table, useReactTable } from "@tanstack/react-table";
import { saveAs } from "file-saver";
import { MoreVertical, X } from "lucide-react";
import { GoTrash } from "react-icons/go";
import { PiExport } from "react-icons/pi";

import { Button } from "@/components/shadcn/button";

import { useDictionary } from "../../layout/dictionary-provider";
import { SearchBar } from "../../search/search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";
import { DataTableViewOptions } from "./data-table-view-options";

interface Filter {
  value: string;
  label: string;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  toolbar: React.ReactNode | ((table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode);
  exportFn?: (params: any) => Promise<Blob>;
  exportFileName?: string;
  showResetButton?: boolean;
  predefinedFilters?: Array<Filter>;
  bulkActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (rows: TData[]) => void;
  }>;
}

export function DataTableToolbar<TData>({
  table,
  toolbar,
  exportFn,
  exportFileName,
  showResetButton = true,
  predefinedFilters = [],
  bulkActions = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

  const { dict } = useDictionary();

  const actions = [
    {
      label: dict?.Shared?.Export,
      icon: <PiExport />,
      onClick: () => {
        exportMutation.mutate({});
      },
    },
    {
      label: dict?.Shared?.Delete,
      icon: <GoTrash className="text-destructive" />,
      onClick: () => {
        console.log("xd");
      },
    },
  ];

  const exportMutation = useMutation({
    mutationFn: exportFn,
    onSuccess: (blob) => {
      saveAs(blob, exportFileName);
    },
  });

  return (
    <div className="relative flex items-center justify-between gap-4">
      <div>{typeof toolbar === "function" ? toolbar(table) : toolbar}</div>

      <div className="flex justify-center absolute left-1/2 transform -translate-x-1/2 w-full max-w-[600px]">
        {/* {hasSelection ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 px-2 lg:px-3">
                <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                    <>
                      {table.getFilteredSelectedRowModel().rows.length} {dict?.DataTable?.of}{" "}
                      {table.getFilteredRowModel().rows.length} {dict?.DataTable?.ItemsSelected}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <MoreVertical className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.map((action) => (
                <DropdownMenuItem key={action.label} onClick={() => action.onClick()}>
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SearchBar predefinedFilters={predefinedFilters} />
        )} */}

        {/* Reset Button */}
        {isFiltered && showResetButton && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            {dict?.DataTable?.Reset}
            <X />
          </Button>
        )}
      </div>
    </div>
  );
}
