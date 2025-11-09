import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/components/layout/Sidebar'
import type { SidebarSection } from '@/routes/types'

type DashboardLayoutProps = {
  sections: SidebarSection[]
}

export function DashboardLayout({ sections }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 border-r border-border lg:block">
        <Sidebar sections={sections} />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur lg:justify-end">
          <span className="text-sm text-muted-foreground">
            Build your admin quickly—customize this layout however you like.
          </span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

