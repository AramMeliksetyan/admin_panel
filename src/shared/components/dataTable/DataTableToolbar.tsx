import * as React from "react";
import { ChevronDown, Filter, Search, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { Sheet, SheetTrigger } from "@/shared/ui/sheet";
import { useTranslation } from "@/shared/context/useTranslation";
import { useDebouncedCallback } from "@/shared/hooks/use-debounced-callback";
import type { FilterConfig } from "./types";
import type { Table } from "@tanstack/react-table";

const SEARCH_DEBOUNCE_MS = 400;

type DataTableToolbarProps<T> = {
  table: Table<T>;
  hasSearchInput: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: FilterConfig[];
  filterableColumnIds: string[];
  activeFiltersCount: number;
  isFiltersOpen: boolean;
  onFiltersOpenChange: (open: boolean) => void;
  filtersSheetContent: React.ReactNode;
};

export function DataTableToolbar<T>({
  table,
  hasSearchInput,
  searchValue,
  onSearchChange,
  activeFiltersCount,
  isFiltersOpen,
  onFiltersOpenChange,
  filtersSheetContent,
}: DataTableToolbarProps<T>) {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = React.useState(searchValue);
  React.useEffect(() => {
    setSearchInput(searchValue);
  }, [searchValue]);

  const debouncedApplySearch = useDebouncedCallback((value: string) => {
    onSearchChange(value);
  }, SEARCH_DEBOUNCE_MS);

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    debouncedApplySearch(value);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    onSearchChange("");
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 flex-1">
        {hasSearchInput && (
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("dataTable.search.placeholder")}
              value={searchInput}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleSearchInputChange(event.target.value)
              }
              className="pl-9"
            />
            {searchInput && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Sheet open={isFiltersOpen} onOpenChange={onFiltersOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              {t("dataTable.filters.button")}
              {activeFiltersCount > 0 && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          {filtersSheetContent}
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {t("dataTable.columns.button")}{" "}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
