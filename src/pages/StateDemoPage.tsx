import { CounterPanel } from '@/components/counter/CounterPanel'

export function StateDemoPage() {
  return (
    <>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-foreground">Local state with Redux Toolkit</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This counter slice lives entirely on the client. Use it as a template for feature stores,
          toggles, or anything else that doesn&apos;t need to hit an API.
        </p>
      </div>
      <CounterPanel />
    </>
  )
}

