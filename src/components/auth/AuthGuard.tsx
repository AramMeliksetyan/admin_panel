import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getStoredToken, getStoredUser, getMockAuthUser } from '@/lib/auth-storage'
import { hydrate, selectAuthToken, selectAuthUser } from '@/features/auth/authSlice'

type AuthGuardProps = {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectAuthToken)
  const user = useAppSelector(selectAuthUser)
  const location = useLocation()
  const [hasHydrated, setHasHydrated] = useState(false)
  const [cachedToken, setCachedToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = getStoredToken()
    if (!token && stored) {
      // Get stored user or use mock user for development
      const storedUser = getStoredUser() ?? getMockAuthUser()
      dispatch(hydrate({ token: stored, user: storedUser }))
    } else if (token && !user) {
      // Token exists but no user, hydrate with mock user
      dispatch(hydrate({ token, user: getMockAuthUser() }))
    }
    setCachedToken(stored)
    setHasHydrated(true)
  }, [dispatch, token, user])

  if (!hasHydrated) {
    return null
  }

  if (!token && !cachedToken) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}

