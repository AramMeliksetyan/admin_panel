import { ChevronDown } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useTranslation } from "@/shared/context/useTranslation";
import type { Table } from "@tanstack/react-table";

const PAGE_SIZES = [5, 10, 20, 50, 100] as const;

type DataTableFooterProps<T> = {
  table: Table<T>;
  pageIndex: number;
  pageSize: number;
  totalRecords: number | undefined;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function DataTableFooter<T>({
  table,
  pageIndex,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
}: DataTableFooterProps<T>) {
  const { t } = useTranslation();

  const summaryText =
    totalRecords !== undefined
      ? t("dataTable.footer.showingEntries", {
          from: String(pageIndex * pageSize + 1),
          to: String(Math.min(pageIndex * pageSize + pageSize, totalRecords)),
          total: String(totalRecords),
        })
      : t("dataTable.footer.selectedCount", {
          selected: String(table.getFilteredSelectedRowModel().rows.length),
          total: String(table.getFilteredRowModel().rows.length),
        });

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="text-muted-foreground flex-1 text-sm">{summaryText}</div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {t("dataTable.footer.rowsPerPage")}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {pageSize} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {PAGE_SIZES.map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => onPageSizeChange(size)}
                >
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
          >
            {t("dataTable.footer.previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={
              totalRecords !== undefined &&
              pageIndex * pageSize + pageSize >= totalRecords
            }
          >
            {t("dataTable.footer.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
