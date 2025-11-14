import { API_URL } from '@/lib/constants'
import { getStoredToken } from '@/lib/auth-storage'
import type { User, PaginatedResponse, GridRequest } from '@/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { transformPaginatedResponse, transformResponse, transformErrorResponse } from './api-helpers'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = getStoredToken()
      if (token) {
        headers.set('authorization', token)
      }
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsersGridData: builder.query<PaginatedResponse<User>, GridRequest>({
      query: (body) => ({
        url: 'user/grid',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown): PaginatedResponse<User> => {
        return transformPaginatedResponse<User>(response)
      },
      transformErrorResponse: (response: unknown) => {
        return transformErrorResponse(response)
      },
      providesTags: (result) =>
        result
          ? [
              ...result.displayData.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User' as const, id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `users/${id}`,
      transformResponse: (response: unknown): User => {
        return transformResponse<User>(response)
      },
      transformErrorResponse: (response: unknown) => {
        return transformErrorResponse(response)
      },
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
  }),
})

export const { useGetUsersGridDataQuery, useGetUserByIdQuery } = userApi

