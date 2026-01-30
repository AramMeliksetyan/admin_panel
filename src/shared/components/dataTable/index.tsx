import * as React from "react";
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
  type SortingState,
} from "@tanstack/react-table";
import { useFormContext } from "react-hook-form";

import { Table } from "@/shared/ui/table";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableFooter } from "./DataTableFooter";
import { DataTableBody } from "./DataTableBody";
import { DataTableFilters } from "./DataTableFilters";

type GridFormValues = {
  pageIndex: number;
  pageSize: number;
  search: string;
  sortColumn: string;
  sortDirection: "asc" | "desc" | "";
  conditionMatch: number;
  isArchived: boolean;
  filters: unknown[];
  scoreFilter: unknown[];
  columnFilters: Record<string, string>;
};

export type FilterConfig = {
  key: string;
  label: string;
  type: "text" | "checkbox" | "select";
  formKey: string; // Key in the form values
  options?: { label: string; value: string | boolean }[]; // For select type
};

export function DataTableDemo<T>({
  columns,
  data,
  totalRecords,
  hasSearchInput = true,
  filters = [],
  filterableColumnIds = [],
  isLoading = false,
  isError = false,
  errorMessage = "An error occurred",
}: {
  columns: ColumnDef<T>[];
  data: T[];
  totalRecords?: number;
  hasSearchInput?: boolean;
  filters?: FilterConfig[];
  filterableColumnIds?: string[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
}) {
  const form = useFormContext<GridFormValues>();
  const { watch, setValue } = form;
  const pageIndex = watch("pageIndex");
  const pageSize = watch("pageSize");
  const search = watch("search");
  const sortColumn = watch("sortColumn");
  const sortDirection = watch("sortDirection");
  const columnFiltersValue = watch("columnFilters");
  const columnFilters = React.useMemo(
    () => columnFiltersValue ?? {},
    [columnFiltersValue]
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  // Get current filter values from form
  const currentFilterValues = React.useMemo(() => {
    const values: Record<string, unknown> = {};
    filters.forEach((filter) => {
      values[filter.formKey] = watch(filter.formKey as keyof GridFormValues);
    });
    return values;
  }, [filters, watch]);

  // Temporary filter state for the filter sidebar
  const [tempFilterValues, setTempFilterValues] =
    React.useState<Record<string, unknown>>(currentFilterValues);

  // Sync temporary state when filters change externally
  React.useEffect(() => {
    setTempFilterValues(currentFilterValues);
  }, [currentFilterValues]);

  // Temporary search state (if search is not in filters)
  const [tempSearch, setTempSearch] = React.useState(search);

  React.useEffect(() => {
    setTempSearch(search);
  }, [search]);

  // Sync sorting state with form
  const sorting: SortingState = React.useMemo(() => {
    if (sortColumn && sortDirection) {
      return [{ id: sortColumn, desc: sortDirection === "desc" }];
    }
    return [];
  }, [sortColumn, sortDirection]);

  const handleSortingChange = (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => {
    const newSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    if (newSorting.length > 0) {
      const sort = newSorting[0];
      setValue("sortColumn", sort.id);
      setValue("sortDirection", sort.desc ? "desc" : "asc");
      setValue("pageIndex", 0); // Reset to first page when sort changes
    } else {
      setValue("sortColumn", "");
      setValue("sortDirection", "");
      setValue("pageIndex", 0);
    }
  };

  // Count active filters (including column filters)
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (search) count++;
    filters.forEach((filter) => {
      const value = currentFilterValues[filter.formKey];
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== false
      ) {
        count++;
      }
    });
    const columnFilterCount = Object.values(columnFilters).filter(
      (v) => v != null && String(v).trim() !== ""
    ).length;
    return count + columnFilterCount;
  }, [search, filters, currentFilterValues, columnFilters]);

  const handlePageChange = (newPageIndex: number) => {
    setValue("pageIndex", newPageIndex);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setValue("pageSize", newPageSize);
    setValue("pageIndex", 0); // Reset to first page when page size changes
  };

  const handleSearchChange = (value: string) => {
    setValue("search", value);
    setValue("pageIndex", 0); // Reset to first page when search changes
  };

  const handleColumnFilterChange = (columnId: string, value: string) => {
    setValue("columnFilters", {
      ...columnFilters,
      [columnId]: value,
    });
    setValue("pageIndex", 0);
  };

  const handleClearFilters = () => {
    setTempSearch("");
    const cleared: Record<string, string | boolean> = {};
    filters.forEach((filter) => {
      if (filter.type === "checkbox") {
        cleared[filter.formKey] = false;
      } else if (filter.type === "select") {
        cleared[filter.formKey] = "";
      } else {
        cleared[filter.formKey] = "";
      }
    });
    setTempFilterValues(cleared);
    setValue("columnFilters", {});
  };

  const handleApplyFilters = () => {
    setValue("search", tempSearch);
    filters.forEach((filter) => {
      setValue(
        filter.formKey as keyof GridFormValues,
        tempFilterValues[filter.formKey] as GridFormValues[keyof GridFormValues]
      );
    });
    setValue("pageIndex", 0); // Reset to first page when filters are applied
    setIsFiltersOpen(false);
  };

  const updateTempFilter = (formKey: string, value: string | boolean) => {
    setTempFilterValues((prev) => ({
      ...prev,
      [formKey]: value,
    }));
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
    manualPagination: true,
    manualSorting: true,
    pageCount: totalRecords ? Math.ceil(totalRecords / pageSize) : undefined,

    state: {
      columnVisibility,
      rowSelection,
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  const filtersSheetContent = (
    <DataTableFilters
      hasSearchInput={hasSearchInput}
      tempSearch={tempSearch}
      onTempSearchChange={setTempSearch}
      filters={filters}
      tempFilterValues={tempFilterValues}
      onUpdateTempFilter={updateTempFilter}
      onClearFilters={handleClearFilters}
      onApplyFilters={handleApplyFilters}
    />
  );

  return (
    <div className="w-full space-y-4">
      <DataTableToolbar
        table={table}
        hasSearchInput={hasSearchInput}
        searchValue={search}
        onSearchChange={handleSearchChange}
        filters={filters}
        filterableColumnIds={filterableColumnIds}
        activeFiltersCount={activeFiltersCount}
        isFiltersOpen={isFiltersOpen}
        onFiltersOpenChange={setIsFiltersOpen}
        filtersSheetContent={filtersSheetContent}
      />
      <DataTableFooter
        table={table}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      <div className="overflow-hidden rounded-md border">
        {isError ? (
          <div className="flex min-h-[200px] items-center justify-center p-8 text-destructive">
            <p className="text-center font-medium">{errorMessage}</p>
          </div>
        ) : (
          <Table>
            <DataTableHeader
              table={table}
              filterableColumnIds={filterableColumnIds}
              columnFilters={columnFilters}
              onColumnFilterChange={handleColumnFilterChange}
            />
            <DataTableBody
              table={table}
              columnsCount={columns.length}
              isLoading={isLoading}
              pageSize={pageSize}
            />
          </Table>
        )}
      </div>
      <DataTableFooter
        table={table}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
