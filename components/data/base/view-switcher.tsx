"use client";

import { ColumnDef, useReactTable } from "@tanstack/react-table";
import clsx from "clsx";
import * as React from "react";
import { FaTable } from "react-icons/fa";
import { LuLayoutGrid } from "react-icons/lu";

import { useDictionary } from "../../layout/dictionary-provider";
import { Button } from "../../shadcn/button";
import { ServerSideDataGrid } from "../views/server-side-data-grid";
import { ServerSideDataTable } from "../views/server-side-data-table";

interface ViewSwitcherProps<TData, TValue> {
  views: DataView[];
  initialView: DataView;
  queryKey: Array<string>;
  queryFn: (params: any) => Promise<{ rows: TData[]; rowCount?: number }>;
  exportFn?: (params: any) => Promise<Blob>;
  exportFileName?: string;
  /**
   * Columns for the DataTable view.
   */
  columns: ColumnDef<TData, TValue>[];
  /**
   * Render function for the DataGrid view.
   */
  renderItem?: (item: TData) => React.ReactNode;
  schema?: (data: TData) => TData;
  toolbar?: React.ReactNode | ((table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode);
}

type DataView = "table" | "grid";

export function ViewSwitcher<TData, TValue>({
  views,
  initialView,
  queryKey,
  queryFn,
  exportFn,
  exportFileName,
  columns,
  renderItem,
  schema,
  toolbar,
}: ViewSwitcherProps<TData, TValue>) {
  const [selectedView, setSelectedView] = React.useState<DataView>(initialView);
  const { dict } = useDictionary();

  const viewOptions: Record<DataView, { label: string; icon: React.ReactNode }> = {
    table: {
      label: dict?.Shared?.TableView,
      icon: <FaTable size={20} />,
    },
    grid: {
      label: dict?.Shared?.GridView,
      icon: <LuLayoutGrid size={20} />,
    },
  };

  return (
    <div className="space-y-4 pb-20">
      {/* View Switcher Buttons */}
      <div className="flex justify-end items-center">
        {views.map((view) => (
          <Button
            size="icon"
            variant="ghost"
            key={view}
            onClick={() => setSelectedView(view)}
            title={viewOptions[view]?.label}
            className={clsx(
              "border-b-2 border-transparent text-muted-foreground rounded-none",
              selectedView === view && "border-primary",
            )}
          >
            {viewOptions[view]?.icon || view}
          </Button>
        ))}
      </div>

      {/* Render Selected View */}
      {selectedView === "table" && views.includes("table") ? (
        <ServerSideDataTable
          columns={columns}
          queryKey={queryKey}
          queryFn={queryFn}
          exportFn={exportFn}
          exportFileName={exportFileName}
          schema={schema}
          toolbar={toolbar}
        />
      ) : selectedView === "grid" && views.includes("grid") ? (
        <ServerSideDataGrid
          columns={columns}
          queryKey={queryKey}
          queryFn={queryFn}
          exportFn={exportFn}
          exportFileName={exportFileName}
          renderItem={renderItem || (() => null)}
          schema={schema}
          toolbar={toolbar}
        />
      ) : null}
    </div>
  );
}
