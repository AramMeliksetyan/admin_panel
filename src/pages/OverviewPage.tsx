import { Button } from '@/components/ui/button'

export function OverviewPage() {
  return (
    <div className="text-center">
      <span className="mb-3 inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        React + TypeScript + Tailwind + shadcn/ui + RTK Query
      </span>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Kickstart your admin dashboard with modern tooling.
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
        This starter stitches together Vite, Tailwind, shadcn/ui, Redux Toolkit, and RTK Query. Use these
        pages as a launchpad for your own routes, widgets, and datasets.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button size="lg">Open the docs</Button>
        <Button size="lg" variant="outline">
          Browse components
        </Button>
      </div>
    </div>
  )
}

