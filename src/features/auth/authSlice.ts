import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { getStoredToken, getStoredUser, type StoredAuthUser } from '@/lib/auth-storage'

type AuthState = {
  token: string | null
  user: StoredAuthUser | null
  status: 'idle' | 'loading' | 'error'
  error?: string
}

const initialToken = getStoredToken()
const initialUser = getStoredUser()

const initialState: AuthState = {
  token: initialToken,
  user: initialUser,
  status: 'idle',
  error: undefined,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.status = 'loading'
      state.error = undefined
    },
    loginSuccess(state, action: PayloadAction<{ token: string; user?: StoredAuthUser | null }>) {
      state.status = 'idle'
      state.token = action.payload.token
      state.user = action.payload.user ?? null
      state.error = undefined
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.status = 'error'
      state.error = action.payload
    },
    logout(state) {
      state.status = 'idle'
      state.token = null
      state.user = null
      state.error = undefined
    },
    hydrate(state, action: PayloadAction<{ token: string | null; user?: StoredAuthUser | null }>) {
      state.token = action.payload.token
      state.user = action.payload.user ?? null
      state.status = 'idle'
      state.error = undefined
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, hydrate } = authSlice.actions
export const authReducer = authSlice.reducer

export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthenticated = (state: { auth: AuthState }) => Boolean(state.auth.token)

