"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions?: Array<{
    label: string;
    onClick: (row: TData) => void;
    icon?: React.ReactNode;
    shortcut?: string;
  }>;
  schema?: (data: TData) => TData;
}

export function DataTableRowActions<TData>({
  row,
  actions = [],
  schema,
}: DataTableRowActionsProps<TData>) {
  const rowData = schema ? schema(row.original) : row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {/* Dynamic Actions */}
        {actions.map((action) => (
          <DropdownMenuItem
            className="flex items-center"
            key={action.label}
            onClick={() => action.onClick(rowData)}
          >
            {action.icon}
            {action.label}
            {action.shortcut && <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
