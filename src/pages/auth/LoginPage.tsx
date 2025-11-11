import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  loginFailure,
  loginStart,
  loginSuccess,
  selectAuthError,
  selectAuthStatus,
} from '@/features/auth/authSlice'
import { setStoredToken, setStoredUser } from '@/lib/auth-storage'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectAuthStatus)
  const error = useAppSelector(selectAuthError)
  const navigate = useNavigate()
  const location = useLocation()
  const [formState, setFormState] = useState({ email: '', password: '' })

  const isLoading = status === 'loading'
  const from = (location.state as { from?: string } | undefined)?.from ?? '/'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(loginStart())

    const { email, password } = formState
    if (!email || !password) {
      dispatch(loginFailure('Email and password are required'))
      return
    }

    // Simulate an async login to demonstrate state flow.
    setTimeout(() => {
      const user = { email, name: email.split('@')[0] ?? 'User' }
      setStoredToken('demo-bearer-token')
      setStoredUser(user)
      dispatch(
        loginSuccess({
          token: 'demo-bearer-token',
          user,
        }),
      )
      navigate(from, { replace: true })
    }, 650)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h2>
        <p className="text-sm text-muted-foreground">
          Use any credentials — the token is stored locally for demo purposes.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <label className="space-y-1 text-sm font-medium text-foreground" htmlFor="login-email">
            Email
          </label>
          <Input
            id="login-email"
            type="email"
            placeholder="ada@example.com"
            value={formState.email}
            onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
        </div>
        <div className="space-y-4">
          <label className="space-y-1 text-sm font-medium text-foreground" htmlFor="login-password">
            Password
          </label>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={formState.password}
            onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button className="w-full" type="submit" size="lg" disabled={isLoading}>
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div className="space-y-2 text-center text-sm text-muted-foreground">
        <p>
          <Link className="font-medium text-foreground hover:underline" to="/auth/forgot-password">
            Forgot your password?
          </Link>
        </p>
        <p>
          Need an account?{' '}
          <Link className="font-medium text-foreground hover:underline" to="/auth/register">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

