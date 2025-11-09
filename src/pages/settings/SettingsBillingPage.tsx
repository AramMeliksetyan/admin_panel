export function SettingsBillingPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Billing</h2>
      <p className="text-sm text-muted-foreground">
        Showcase invoices, payment methods, or subscription tiers here. Swap this placeholder with live
        billing data whenever you connect your backend.
      </p>

      <div className="rounded-lg border border-border bg-background px-4 py-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Current plan</p>
        <p className="mt-1">Pro — $49/mo</p>
        <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">Next invoice</p>
        <p className="mt-1 text-foreground">Dec 1, 2025</p>
      </div>
    </div>
  )
}

