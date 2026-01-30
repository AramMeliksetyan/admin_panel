import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { jsonPlaceholderApi } from '@/shared/api/jsonPlaceholderApi'
import { counterReducer } from '@/features/counter/counterSlice'
import { authReducer } from '@/features/auth/authSlice'
import { userApi } from '@/entities/user/api/userApi'

export const store = configureStore({
  reducer: {
    [jsonPlaceholderApi.reducerPath]: jsonPlaceholderApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    counter: counterReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jsonPlaceholderApi.middleware, userApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)
