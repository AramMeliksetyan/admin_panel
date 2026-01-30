export type GridRequest = {
  start: number
  length: number
  search?: string
  sortColumn?: string
  sortDirection?: 'asc' | 'desc' | ''
  conditionMatch?: number
  isArchived?: boolean
  filters?: unknown[]
  scoreFilter?: unknown[]
  /** Per-column filter values sent to backend (column id -> filter text) */
  columnFilters?: Record<string, string>
}
