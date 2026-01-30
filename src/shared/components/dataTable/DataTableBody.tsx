import { flexRender } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { useTranslation } from "@/shared/context/useTranslation";
import type { Table } from "@tanstack/react-table";

type DataTableBodyProps<T> = {
  table: Table<T>;
  columnsCount: number;
};

export function DataTableBody<T>({
  table,
  columnsCount,
}: DataTableBodyProps<T>) {
  const { t } = useTranslation();

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
