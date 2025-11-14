/**
 * Generic paginated API response type
 * @template T - The type of items in the displayData array
 */
export type PaginatedResponse<T> = {
  totalRecords: number
  totalDisplayRecords: number
  displayData: T[]
  allIds: number[]
}

