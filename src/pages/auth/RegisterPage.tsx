import { Link, useNavigate } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppDispatch } from '@/lib/hooks'
import { loginSuccess } from '@/features/auth/authSlice'
import { setStoredToken, setStoredUser } from '@/lib/auth-storage'

export function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const form = useForm<RegisterFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })
  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = form

  const onSubmit = handleSubmit(({ name, email, password }) => {
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
    reset()
  })

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Create account</h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ll store a bearer token in localStorage to keep you signed in.
        </p>
      </div>

      <FormProvider {...form}>
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          <div className="space-y-4">
            <label className="space-y-1 text-sm font-medium text-foreground" htmlFor="register-name">
              Name
            </label>
            <Input<RegisterFormValues>
              id="register-name"
              name="name"
              placeholder="Ada Lovelace"
              rules={{ required: 'Name is required' }}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-4">
            <label className="space-y-1 text-sm font-medium text-foreground" htmlFor="register-email">
              Email
            </label>
            <Input<RegisterFormValues>
              id="register-email"
              name="email"
              type="email"
              placeholder="ada@example.com"
              rules={{ required: 'Email is required' }}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-4">
            <label
              className="space-y-1 text-sm font-medium text-foreground"
              htmlFor="register-password"
            >
              Password
            </label>
            <Input<RegisterFormValues>
              id="register-password"
              name="password"
              type="password"
              placeholder="••••••••"
              rules={{ required: 'Password is required' }}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button className="w-full" type="submit" size="lg">
            Sign up
          </Button>
        </form>
      </FormProvider>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link className="font-medium text-foreground hover:underline" to="/auth/login">
          Sign in
        </Link>
      </p>
    </div>
  )
}

type RegisterFormValues = {
  name: string
  email: string
  password: string
}

