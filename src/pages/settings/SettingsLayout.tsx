import { NavLink, Outlet } from 'react-router-dom'

import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Profile', to: '/settings/profile' },
  { label: 'Billing', to: '/settings/billing' },
]

export function SettingsLayout() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Workspace settings</h1>
        <p className="text-sm text-muted-foreground">
          These routes demonstrate nested layouts. Each tab renders inside the shared settings layout.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-background px-4 py-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur">
        <Outlet />
      </div>
    </section>
  )
}

