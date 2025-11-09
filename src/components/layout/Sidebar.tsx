import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'
import type { SidebarSection } from '@/routes/types'

type SidebarProps = {
  sections: SidebarSection[]
}

export function Sidebar({ sections }: SidebarProps) {
  return (
    <div className="flex h-full flex-col border-border bg-muted/30 px-4 py-6 text-sm">
      <div className="mb-8">
        <span className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Shading Admin
        </span>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )
                    }
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 text-xs text-muted-foreground">
        <p className="leading-relaxed">
          Quick access to pages and demos. Add your own sections or link real screens as you grow the
          app.
        </p>
      </div>
    </div>
  )
}

