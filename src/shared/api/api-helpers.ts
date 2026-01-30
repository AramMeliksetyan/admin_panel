import type { PaginatedResponse } from '@/shared/types'

/**
 * Transforms API response to handle different response formats
 * Handles cases where response might be wrapped in a data property
 */
export function transformPaginatedResponse<T>(
  response: unknown
): PaginatedResponse<T> {
  // Handle if response is wrapped in a data property
  const data = (response as { data?: PaginatedResponse<T> }).data || response

  // Ensure it matches the expected structure
  if (data && typeof data === 'object' && 'displayData' in data) {
    return data as PaginatedResponse<T>
  }

  // Fallback: return as-is if structure is correct
  return response as PaginatedResponse<T>
}

/**
 * Transforms a simple API response (non-paginated)
 * Handles cases where response might be wrapped in a data property
 */
export function transformResponse<T>(response: unknown): T {
  // Handle if response is wrapped in a data property
  const data = (response as { data?: T }).data || response

  return data as T
}

/**
 * Transforms error response for consistent error handling
 */
export function transformErrorResponse(response: unknown): unknown {
  // Handle different error response formats
  if (response && typeof response === 'object') {
    // If error has a message property, return it
    if ('message' in response) {
      return response
    }
    // If error is wrapped in an error property
    if ('error' in response) {
      return (response as { error: unknown }).error
    }
  }

  return response
}

/**
 * Extracts a user-friendly error message from RTK Query FetchBaseQueryError
 * (or any error-like object). Use when passing error state to shared components.
 */
export function getFetchErrorMessage(
  error: unknown,
  fallback = 'An error occurred'
): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data: unknown }).data
    if (
      data !== null &&
      typeof data === 'object' &&
      'message' in data
    ) {
      return String((data as { message: unknown }).message)
    }
  }
  return fallback
}
