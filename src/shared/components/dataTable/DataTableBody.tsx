import { flexRender } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { Skeleton } from "@/shared/ui/skeleton";
import { useTranslation } from "@/shared/context/useTranslation";
import type { Table } from "@tanstack/react-table";

type DataTableBodyProps<T> = {
  table: Table<T>;
  columnsCount: number;
  isLoading?: boolean;
  pageSize?: number;
};

export function DataTableBody<T>({
  table,
  columnsCount,
  isLoading = false,
  pageSize = 10,
}: DataTableBodyProps<T>) {
  const { t } = useTranslation();

  if (isLoading) {
    const skeletonRowCount = Math.min(pageSize, 10);
    return (
      <TableBody>
        {Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
          <TableRow key={`skeleton-${rowIndex}`}>
            {Array.from({ length: columnsCount }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-5 w-full min-w-[60px]" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }

  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columnsCount} className="h-24 text-center">
            {t("dataTable.body.noResults")}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
