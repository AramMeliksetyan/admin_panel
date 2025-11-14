import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { logout, selectAuthUser } from '@/features/auth/authSlice'
import { clearStoredToken, clearStoredUser } from '@/lib/auth-storage'
import type { SidebarSection } from '@/routes/types'
import { cn } from '@/lib/utils'

type DashboardLayoutProps = {
  sections: SidebarSection[]
}

function AppSidebar({ sections }: { sections: SidebarSection[] }) {
  const { setOpenMobile, isMobile } = useSidebar()

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Shading Admin
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              {section.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    )
                  }
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.title}</span>
                </NavLink>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-1.5 text-xs text-sidebar-foreground/70">
          <p className="leading-relaxed">
            Quick access to pages and demos. Add your own sections or link real screens as you grow the
            app.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export function DashboardLayout({ sections }: DashboardLayoutProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(selectAuthUser)

  const handleLogout = () => {
    dispatch(logout())
    clearStoredToken()
    clearStoredUser()
    navigate('/auth/login', { replace: true })
  }

  return (
    <SidebarProvider>
      <AppSidebar sections={sections} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between gap-4">
            <div className="hidden text-sm text-muted-foreground lg:block">
              Build your admin quickly—customize this layout however you like.
            </div>
            <div className="ml-auto flex items-center gap-3">
              {user ? (
                <div className="text-sm text-muted-foreground">
                  Signed in as{' '}
                  <span className="font-medium text-foreground">{user.name ?? user.email}</span>
                </div>
              ) : null}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

