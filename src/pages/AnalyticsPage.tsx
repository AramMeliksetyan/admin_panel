export function AnalyticsPage() {
  return (
    <section className="rounded-xl border border-border bg-card/70 p-6 text-left shadow-sm backdrop-blur">
      <h2 className="text-2xl font-semibold text-foreground">Analytics Snapshot</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Plug in your preferred charts or metrics here. This placeholder highlights where you can surface
        KPIs, conversion funnels, or any other visualizations important to your product.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-background px-4 py-5">
          <p className="text-sm text-muted-foreground">Active users</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">1,284</p>
          <p className="mt-1 text-xs text-emerald-500">+12% vs. last week</p>
        </div>
        <div className="rounded-lg border border-border bg-background px-4 py-5">
          <p className="text-sm text-muted-foreground">Conversion rate</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">4.8%</p>
          <p className="mt-1 text-xs text-emerald-500">+0.6% vs. last week</p>
        </div>
      </div>
    </section>
  )
}

