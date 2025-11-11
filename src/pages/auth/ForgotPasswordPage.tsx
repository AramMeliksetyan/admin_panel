import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Reset password</h2>
        <p className="text-sm text-muted-foreground">
          Enter the email you used to sign up. We&apos;ll simulate sending a reset link.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <label className="space-y-1 text-sm font-medium text-foreground" htmlFor="forgot-email">
            Email
          </label>
          <Input
            id="forgot-email"
            type="email"
            placeholder="ada@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
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

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{' '}
        <Link className="font-medium text-foreground hover:underline" to="/auth/login">
          Go back to sign in
        </Link>
      </p>
    </div>
  )
}

