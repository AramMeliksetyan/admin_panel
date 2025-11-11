const TOKEN_KEY = 'shading_app.auth_token'
const USER_KEY = 'shading_app.auth_user'

const isBrowser = () => typeof window !== 'undefined'

export type StoredAuthUser = {
  email?: string
  name?: string
}

export function getStoredToken(): string | null {
  if (!isBrowser()) return null
  return window.localStorage.getItem(TOKEN_KEY)
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

