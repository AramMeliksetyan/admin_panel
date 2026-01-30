import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { GridRequest } from "@/shared/types";
import type { GridFormValues } from "@/shared/components/dataTable/types";

/**
 * Builds a GridRequest from the current grid form values.
 * Pass the grid form instance (the same one you pass to FormProvider).
 * When form values change (page, sort, filters), the returned request updates
 * so the parent query refetches.
 */
export function useGridRequest(
  form: UseFormReturn<GridFormValues>
): GridRequest {
  const { watch } = form;
  const pageIndex = watch("pageIndex");
  const pageSize = watch("pageSize");
  const search = watch("search");
  const sortColumn = watch("sortColumn");
  const sortDirection = watch("sortDirection");
  const conditionMatch = watch("conditionMatch");
  const isArchived = watch("isArchived");
  const filters = watch("filters");
  const scoreFilter = watch("scoreFilter");
  const columnFilters = watch("columnFilters");

  return useMemo(
    () => ({
      start: pageIndex * pageSize,
      length: pageSize,
      search,
      sortColumn,
      sortDirection,
      conditionMatch,
      isArchived,
      filters,
      scoreFilter,
      columnFilters:
        columnFilters && Object.keys(columnFilters).length > 0
          ? columnFilters
          : undefined,
    }),
    [
      pageIndex,
      pageSize,
      search,
      sortColumn,
      sortDirection,
      conditionMatch,
      isArchived,
      filters,
      scoreFilter,
      columnFilters,
    ]
  );
}
