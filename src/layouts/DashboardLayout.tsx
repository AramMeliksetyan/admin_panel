import { Outlet, useNavigate } from 'react-router-dom'

import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { logout, selectAuthUser } from '@/features/auth/authSlice'
import { clearStoredToken, clearStoredUser } from '@/lib/auth-storage'
import type { SidebarSection } from '@/routes/types'

type DashboardLayoutProps = {
  sections: SidebarSection[]
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
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 border-r border-border lg:block">
        <Sidebar sections={sections} />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
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

