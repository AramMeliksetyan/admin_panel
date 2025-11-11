import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getStoredToken, getStoredUser } from '@/lib/auth-storage'
import { hydrate, selectAuthToken } from '@/features/auth/authSlice'

type AuthGuardProps = {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectAuthToken)
  const location = useLocation()
  const [hasHydrated, setHasHydrated] = useState(false)
  const [cachedToken, setCachedToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = getStoredToken()
    if (!token && stored) {
      dispatch(hydrate({ token: stored, user: getStoredUser() }))
    }
    setCachedToken(stored)
    setHasHydrated(true)
  }, [dispatch, token])

  if (!hasHydrated) {
    return null
  }

  if (!token && !cachedToken) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}

