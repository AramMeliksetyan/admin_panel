import { bearer_token } from "./constants"
import type { Role, Permission } from "@/types"
import { getPermissionsForRoles, ROLES } from "@/types"

const TOKEN_KEY = 'shading_app.auth_token'
const USER_KEY = 'shading_app.auth_user'

const isBrowser = () => typeof window !== 'undefined'

export type StoredAuthUser = {
  id?: number
  email?: string
  name?: string
  roles: Role[]
  permissions: Permission[]
}

/**
 * Create a user object with computed permissions from roles
 */
export function createAuthUser(userData: Omit<StoredAuthUser, 'permissions'> & { permissions?: Permission[] }): StoredAuthUser {
  const permissions = userData.permissions ?? getPermissionsForRoles(userData.roles)
  return {
    ...userData,
    permissions,
  }
}

/**
 * Get a mock user for development purposes
 * In production, this would come from your authentication API
 */
export function getMockAuthUser(): StoredAuthUser {
  return createAuthUser({
    id: 1,
    email: 'admin@example.com',
    name: 'Admin User',
    roles: [ROLES.ADMIN],
  })
}

export function getStoredToken(): string | null {
  if (!isBrowser()) return null
  // return window.localStorage.getItem(TOKEN_KEY)
  return bearer_token
}

export function setStoredToken(token: string) {
  if (!isBrowser()) return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken() {
  if (!isBrowser()) return
  window.localStorage.removeItem(TOKEN_KEY)
}

export function getStoredUser(): StoredAuthUser | null {
  if (!isBrowser()) return null
  const raw = window.localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredAuthUser
  } catch {
    return null
  }
}

export function setStoredUser(user: StoredAuthUser | null) {
  if (!isBrowser()) return
  if (!user) {
    window.localStorage.removeItem(USER_KEY)
    return
  }
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearStoredUser() {
  if (!isBrowser()) return
  window.localStorage.removeItem(USER_KEY)
}

