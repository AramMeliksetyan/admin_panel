import * as React from "react";
import { Input } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { Separator } from "@/shared/ui/separator";
import { useTranslation } from "@/shared/context/useTranslation";
import type { FilterConfig } from "./types";

type DataTableFiltersProps = {
  hasSearchInput: boolean;
  tempSearch: string;
  onTempSearchChange: (value: string) => void;
  filters: FilterConfig[];
  tempFilterValues: Record<string, unknown>;
  onUpdateTempFilter: (formKey: string, value: string | boolean) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
};

export function DataTableFilters({
  hasSearchInput,
  tempSearch,
  onTempSearchChange,
  filters,
  tempFilterValues,
  onUpdateTempFilter,
  onClearFilters,
  onApplyFilters,
}: DataTableFiltersProps) {
  const { t } = useTranslation();

  return (
    <SheetContent side="right" className="w-[400px] sm:w-[540px]">
      <SheetHeader>
        <SheetTitle>{t("dataTable.filters.title")}</SheetTitle>
        <SheetDescription>
          {t("dataTable.filters.description")}
        </SheetDescription>
      </SheetHeader>
      <div className="mt-6 space-y-6">
        <div className="space-y-4">
          {hasSearchInput && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("dataTable.search.label")}
                </label>
                <Input
                  placeholder={t("dataTable.search.placeholder")}
                  value={tempSearch}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => onTempSearchChange(event.target.value)}
                />
              </div>
              {filters.length > 0 && <Separator />}
            </>
          )}

          {filters.map((filter, index) => (
            <React.Fragment key={filter.key}>
              <div className="space-y-2">
                <label className="text-sm font-medium">{filter.label}</label>
                {filter.type === "text" && (
                  <Input
                    placeholder={`${t("dataTable.filters.enter")} ${filter.label.toLowerCase()}...`}
                    value={String(tempFilterValues[filter.formKey] ?? "")}
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) =>
                      onUpdateTempFilter(filter.formKey, event.target.value)
                    }
                  />
                )}
                {filter.type === "checkbox" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={filter.key}
                      checked={Boolean(tempFilterValues[filter.formKey])}
                      onCheckedChange={(checked) => {
                        onUpdateTempFilter(filter.formKey, !!checked);
                      }}
                    />
                    <label
                      htmlFor={filter.key}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {filter.label}
                    </label>
                  </div>
                )}
                {filter.type === "select" && filter.options && (
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={String(tempFilterValues[filter.formKey] ?? "")}
                    onChange={(event) =>
                      onUpdateTempFilter(filter.formKey, event.target.value)
                    }
                  >
                    <option value="">{t("dataTable.filters.all")}</option>
                    {filter.options.map((option) => (
                      <option
                        key={String(option.value)}
                        value={String(option.value)}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {index < filters.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClearFilters}>
            {t("dataTable.filters.clearAll")}
          </Button>
          <Button className="flex-1" onClick={onApplyFilters}>
            {t("dataTable.filters.apply")}
          </Button>
        </div>
      </div>
    </SheetContent>
  );
}
