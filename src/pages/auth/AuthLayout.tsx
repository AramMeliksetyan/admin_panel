import { Link, Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden flex-1 items-center justify-center bg-muted/40 px-8 py-10 lg:flex">
        <div className="w-full max-w-md space-y-6 text-left">
          <span className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Shading Admin
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Ship dashboards faster with blocks you can trust.
          </h1>
          <p className="text-sm text-muted-foreground">
            This starter stitches together authentication, routing, Tailwind CSS, shadcn/ui, and RTK
            Query so you can focus on product features instead of boilerplate.
          </p>
          <div className="rounded-xl border border-border bg-background/70 p-4 text-xs text-muted-foreground shadow-sm">
            Use any credentials to sign in—we&apos;re simulating auth locally by storing a bearer token in
            `localStorage`.
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
              ← Back to dashboard
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

