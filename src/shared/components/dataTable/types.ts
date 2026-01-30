export type GridFormValues = {
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
  formKey: string;
  options?: { label: string; value: string | boolean }[];
};
