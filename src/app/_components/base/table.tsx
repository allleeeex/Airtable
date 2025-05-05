/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";
import { useEffect, useMemo, useRef } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { api } from "~/trpc/react";
import { useBaseStore } from "~/stores/baseStore";
import React from "react";

interface TableProps {
  selectedTableId: string;
}

type Cell = {
  fieldId: string;
  value: unknown;
};

type RecordRow = {
  id: string;
  order: string;
  cells: Cell[];
};

export function Table({ selectedTableId }: TableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { data: table, isLoading } = api.table.getTableById.useQuery({ id: selectedTableId });
  const { 
    data: recordPages, 
    isLoading: recordsLoading, 
    fetchNextPage, 
    hasNextPage } = api.table.getRecordsForTable.useInfiniteQuery(
      { 
        tableId: selectedTableId, 
        limit: 100 
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!table,
      }
    );

  const records = useMemo(
    () => recordPages?.pages.flatMap((page) => page.rows) ?? [],
    [recordPages]
  );
  
  const columns = useMemo<ColumnDef<RecordRow>[]>(
    () =>
      table?.fields.map((field) => ({
        accessorFn: (row: RecordRow) => {
          const cell = row.cells.find((c) => c.fieldId === field.id);
          return typeof cell?.value === "string" || typeof cell?.value === "number"
            ? cell.value
            : "";
        },
        id: field.id,
        header: field.name,
        cell: (info) => info.getValue(),
      })) ?? [],
    [table]
  );  

  const tableInstance = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rowVirtualizer = useVirtualizer({
    count: tableInstance.getRowModel().rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  useEffect(() => {
    const last = virtualRows[virtualRows.length - 1];
    if (!last) return;
    if (last.index >= records.length - 10 && hasNextPage) {
      void fetchNextPage();
    }
  }, [virtualRows, fetchNextPage, hasNextPage, records]);

  if (isLoading || recordsLoading) {
    return <div></div>;
  }

  return (
    <div ref={tableContainerRef} className="" style={{ height: 600, overflow: "auto" }}>
      {/* Sticky Column Headers */}
      <div className="flex sticky top-0 bg-white border-b z-10">
        {tableInstance.getHeaderGroups()[0]!.headers.map((header) => (
          <div
            key={header.id}
            style={{ minWidth: 300, padding: 8, fontWeight: "bold", flex: 1 }}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
          </div>
        ))}
      </div>
  
      {/* Virtualized rows */}
      <div style={{ height: `${totalSize}px`, position: "relative" }}>
        {virtualRows.map((virtualRow) => {
          const row = tableInstance.getRowModel().rows[virtualRow.index];
          return (
            <div
              key={row!.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translateY(${virtualRow.start}px)`,
                display: "flex",
              }}
            >
              {row!.getVisibleCells().map((cell) => (
                <div
                  key={cell.id}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minWidth: 300,
                    padding: 8,
                    border: "1px solid #e5e7eb",
                    flex: 1,
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
  
}
