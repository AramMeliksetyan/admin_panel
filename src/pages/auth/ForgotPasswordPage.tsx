import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const form = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: '',
    },
  })
  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = form

  const onSubmit = handleSubmit(({ email }) => {
    if (!email) return
    setSubmitted(true)
    reset()
  })

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Reset password</h2>
        <p className="text-sm text-muted-foreground">
          Enter the email you used to sign up. We&apos;ll simulate sending a reset link.
        </p>
      </div>

      <FormProvider {...form}>
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          <div className="space-y-4">
            <label className="space-y-1 text-sm font-medium text-foreground" htmlFor="forgot-email">
              Email
            </label>
            <Input<ForgotPasswordFormValues>
              id="forgot-email"
              name="email"
              type="email"
              placeholder="ada@example.com"
              rules={{ required: 'Email is required' }}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          {submitted ? (
            <p className="rounded-md border border-border bg-background px-3 py-2 text-sm text-emerald-600">
              If this email exists in our system, you&apos;ll receive reset instructions shortly.
            </p>
          ) : null}

          <Button className="w-full" type="submit" size="lg" disabled={submitted}>
            {submitted ? 'Email sent' : 'Send reset link'}
          </Button>
        </form>
      </FormProvider>

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{' '}
        <Link className="font-medium text-foreground hover:underline" to="/auth/login">
          Go back to sign in
        </Link>
      </p>
    </div>
  )
}

type ForgotPasswordFormValues = {
  email: string
}

