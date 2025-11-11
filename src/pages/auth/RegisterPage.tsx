import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppDispatch } from '@/lib/hooks'
import { loginSuccess } from '@/features/auth/authSlice'
import { setStoredToken, setStoredUser } from '@/lib/auth-storage'

export function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [formState, setFormState] = useState({ name: '', email: '', password: '' })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { name, email, password } = formState
    if (!name || !email || !password) return

    // Simulate successful registration -> automatically log the user in.
    setStoredToken('demo-bearer-token')
    setStoredUser({ email, name })
    dispatch(
      loginSuccess({
        token: 'demo-bearer-token',
        user: { email, name },
      }),
    )
    navigate('/', { replace: true })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Create account</h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ll store a bearer token in localStorage to keep you signed in.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <label className="space-y-1 text-sm font-medium text-foreground" htmlFor="register-name">
            Name
          </label>
          <Input
            id="register-name"
            placeholder="Ada Lovelace"
            value={formState.name}
            onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
        </div>
        <div className="space-y-4">
          <label className="space-y-1 text-sm font-medium text-foreground" htmlFor="register-email">
            Email
          </label>
          <Input
            id="register-email"
            type="email"
            placeholder="ada@example.com"
            value={formState.email}
            onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
        </div>
        <div className="space-y-4">
          <label
            className="space-y-1 text-sm font-medium text-foreground"
            htmlFor="register-password"
          >
            Password
          </label>
          <Input
            id="register-password"
            type="password"
            placeholder="••••••••"
            value={formState.password}
            onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
        </div>
        <Button className="w-full" type="submit" size="lg">
          Sign up
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link className="font-medium text-foreground hover:underline" to="/auth/login">
          Sign in
        </Link>
      </p>
    </div>
  )
}

