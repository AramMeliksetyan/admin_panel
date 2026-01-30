import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import { Input } from "@/shared/ui/input";
import { TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { useTranslation } from "@/shared/context/useTranslation";
import type { Table } from "@tanstack/react-table";

type DataTableHeaderProps<T> = {
  table: Table<T>;
  filterableColumnIds: string[];
  columnFilters: Record<string, string>;
  onColumnFilterChange: (columnId: string, value: string) => void;
};

export function DataTableHeader<T>({
  table,
  filterableColumnIds,
  columnFilters,
  onColumnFilterChange,
}: DataTableHeaderProps<T>) {
  const { t } = useTranslation();

  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <React.Fragment key={headerGroup.id}>
          <TableRow>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
          {filterableColumnIds.length > 0 && (
            <TableRow className="hover:bg-transparent bg-muted/40 border-b">
              {headerGroup.headers.map((header) => {
                const columnId =
                  header.column.id ??
                  (header.column.columnDef as { accessorKey?: string })
                    .accessorKey;
                const isFilterable =
                  columnId && filterableColumnIds.includes(columnId);
                return (
                  <TableHead
                    key={`filter-${header.id}`}
                    className="py-1.5 align-bottom h-auto min-w-0"
                  >
                    {isFilterable ? (
                      <Input
                        placeholder={t("dataTable.columnFilter.placeholder")}
                        value={
                          columnId ? columnFilters[columnId] ?? "" : ""
                        }
                        onChange={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ) =>
                          columnId &&
                          onColumnFilterChange(columnId, e.target.value)
                        }
                        className="h-8 text-sm min-w-[80px]"
                      />
                    ) : null}
                  </TableHead>
                );
              })}
            </TableRow>
          )}
        </React.Fragment>
      ))}
    </TableHeader>
  );
}
