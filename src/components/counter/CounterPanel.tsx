import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { decrement, increment, reset, setStep } from '@/features/counter/counterSlice'

export function CounterPanel() {
  const [customStep, setCustomStep] = useState('1')
  const dispatch = useAppDispatch()
  const { value, step } = useAppSelector((state) => state.counter)

  const handleStepChange = () => {
    const parsed = Number(customStep)
    if (!Number.isNaN(parsed) && parsed > 0) {
      dispatch(setStep(parsed))
    }
  }

  return (
    <section className="mt-14 w-full max-w-xl rounded-xl border border-border bg-card/70 p-6 text-left shadow-sm backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Local Redux state</h2>
          <p className="text-sm text-muted-foreground">
            This counter uses a regular Redux slice. Actions dispatch synchronously on the client only.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => dispatch(reset())}>
          Reset
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
          <span className="text-sm text-muted-foreground">Current value</span>
          <span className="text-3xl font-semibold text-foreground">{value}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => dispatch(decrement())}>- {step}</Button>
          <Button onClick={() => dispatch(increment())}>+ {step}</Button>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground" htmlFor="custom-step">
              Step
            </label>
            <input
              id="custom-step"
              type="number"
              min={1}
              value={customStep}
              onChange={(event) => setCustomStep(event.target.value)}
              onBlur={handleStepChange}
              className="h-9 w-20 rounded-md border border-border bg-background px-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <Button variant="outline" size="sm" onClick={handleStepChange}>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

