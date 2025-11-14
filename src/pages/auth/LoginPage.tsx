import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'

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
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = form

  const isLoading = status === 'loading'
  const from = (location.state as { from?: string } | undefined)?.from ?? '/'

  const onSubmit = handleSubmit(({ email }) => {
    dispatch(loginStart())

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
      reset()
    }, 650)
  }, () => {
    dispatch(loginFailure('Email and password are required'))
  })

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h2>
        <p className="text-sm text-muted-foreground">
          Use any credentials — the token is stored locally for demo purposes.
        </p>
      </div>

      <FormProvider {...form}>
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          <div className="space-y-4">
            <label className="space-y-1 text-sm font-medium text-foreground" htmlFor="login-email">
              Email
            </label>
            <Input<LoginFormValues>
              id="login-email"
              name="email"
              type="email"
              placeholder="ada@example.com"
              rules={{ required: 'Email is required' }}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-4">
            <label className="space-y-1 text-sm font-medium text-foreground" htmlFor="login-password">
              Password
            </label>
            <Input<LoginFormValues>
              id="login-password"
              name="password"
              type="password"
              placeholder="••••••••"
              rules={{ required: 'Password is required' }}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button className="w-full" type="submit" size="lg" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </FormProvider>

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

type LoginFormValues = {
  email: string
  password: string
}

