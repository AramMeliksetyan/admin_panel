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
}

