import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { getStoredToken, getStoredUser, type StoredAuthUser } from '@/shared/lib/auth-storage'
import type { Permission, Role } from '@/shared/types'

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

// Base selectors
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthenticated = (state: { auth: AuthState }) => Boolean(state.auth.token)

// Permission selectors
export const selectUserRoles = (state: { auth: AuthState }): Role[] => 
  state.auth.user?.roles ?? []

export const selectUserPermissions = (state: { auth: AuthState }): Permission[] => 
  state.auth.user?.permissions ?? []

export const selectHasPermission = (permission: Permission) => 
  (state: { auth: AuthState }): boolean => 
    state.auth.user?.permissions?.includes(permission) ?? false

export const selectHasAnyPermission = (permissions: Permission[]) => 
  (state: { auth: AuthState }): boolean => 
    permissions.some((p) => state.auth.user?.permissions?.includes(p) ?? false)

export const selectHasAllPermissions = (permissions: Permission[]) => 
  (state: { auth: AuthState }): boolean => 
    permissions.every((p) => state.auth.user?.permissions?.includes(p) ?? false)

export const selectHasRole = (role: Role) => 
  (state: { auth: AuthState }): boolean => 
    state.auth.user?.roles?.includes(role) ?? false

export const selectHasAnyRole = (roles: Role[]) => 
  (state: { auth: AuthState }): boolean => 
    roles.some((r) => state.auth.user?.roles?.includes(r) ?? false)

