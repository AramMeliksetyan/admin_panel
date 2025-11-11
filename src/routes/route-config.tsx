import { Outlet, Route } from 'react-router-dom'
import {
  Activity,
  LayoutDashboard,
  LineChart,
  ListTree,
  UserCog,
  Wallet,
} from 'lucide-react'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { OverviewPage } from '@/pages/OverviewPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { PostsPage } from '@/pages/PostsPage'
import { StateDemoPage } from '@/pages/StateDemoPage'
import { SettingsLayout } from '@/pages/settings/SettingsLayout'
import { SettingsProfilePage } from '@/pages/settings/SettingsProfilePage'
import { SettingsBillingPage } from '@/pages/settings/SettingsBillingPage'
import { AuthLayout } from '@/pages/auth/AuthLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import type {
  AppRoute,
  RouteContext,
  SidebarLink,
  SidebarSection,
} from '@/routes/types'

const routeConfig: AppRoute = {
  id: 'root',
  path: '/',
  element: ({ sidebarSections }) => (
    <AuthGuard>
      <DashboardLayout sections={sidebarSections} />
    </AuthGuard>
  ),
  children: [
    {
      id: 'overview',
      index: true,
      label: 'Overview',
      icon: LayoutDashboard,
      component: OverviewPage,
      sidebar: { section: 'Dashboard', order: 1, linkOrder: 1 },
    },
    {
      id: 'overview-alias',
      path: 'overview',
      component: OverviewPage,
    },
    {
      id: 'analytics',
      path: 'analytics',
      label: 'Analytics',
      icon: LineChart,
      component: AnalyticsPage,
      sidebar: { section: 'Dashboard', order: 1, linkOrder: 2 },
    },
    {
      id: 'data',
      path: 'data',
      element: <Outlet />,
      children: [
        {
          id: 'data-index',
          index: true,
          component: PostsPage,
        },
        {
          id: 'data-posts',
          path: 'posts',
          label: 'Posts feed',
          icon: ListTree,
          component: PostsPage,
          sidebar: { section: 'Data', order: 2, linkOrder: 1 },
        },
      ],
    },
    {
      id: 'state',
      path: 'state',
      element: <Outlet />,
      children: [
        {
          id: 'state-index',
          index: true,
          component: StateDemoPage,
        },
        {
          id: 'state-counter',
          path: 'counter',
          label: 'Redux counter',
          icon: Activity,
          component: StateDemoPage,
          sidebar: { section: 'State demos', order: 3, linkOrder: 1 },
        },
      ],
    },
    {
      id: 'settings',
      path: 'settings',
      element: <SettingsLayout />,
      children: [
        {
          id: 'settings-index',
          index: true,
          component: SettingsProfilePage,
        },
        {
          id: 'settings-profile',
          path: 'profile',
          label: 'Profile',
          icon: UserCog,
          component: SettingsProfilePage,
          sidebar: { section: 'Settings', order: 4, linkOrder: 1 },
        },
        {
          id: 'settings-billing',
          path: 'billing',
          label: 'Billing',
          icon: Wallet,
          component: SettingsBillingPage,
          sidebar: { section: 'Settings', order: 4, linkOrder: 2 },
        },
      ],
    },
  ],
}

const authRoute: AppRoute = {
  id: 'auth',
  path: 'auth',
  element: <AuthLayout />,
  children: [
    {
      id: 'auth-login',
      path: 'login',
      component: LoginPage,
    },
    {
      id: 'auth-register',
      path: 'register',
      component: RegisterPage,
    },
    {
      id: 'auth-forgot',
      path: 'forgot-password',
      component: ForgotPasswordPage,
    },
  ],
}

const sidebarSections = buildSidebarSections(routeConfig)

function renderRoute(route: AppRoute, context: RouteContext) {
  const children = route.children?.map((child) => renderRoute(child, context))

  if (route.index) {
    return <Route key={route.id} index element={resolveElement(route, context)} />
  }

  return (
    <Route key={route.id} path={route.path} element={resolveElement(route, context)}>
      {children}
    </Route>
  )
}

function resolveElement(route: AppRoute, context: RouteContext) {
  if (typeof route.element === 'function') {
    return route.element(context)
  }

  if (route.element) {
    return route.element
  }

  if (route.component) {
    const Component = route.component
    return <Component />
  }

  if (route.children?.length) {
    return <Outlet />
  }

  throw new Error(`Route "${route.id}" is missing an element or component`)
}

function buildSidebarSections(root: AppRoute): SidebarSection[] {
  const sectionMap = new Map<string, SidebarSection>()

  const traverse = (node: AppRoute, basePath: string) => {

    const currentPath = resolveFullPath(basePath, node)

    if (node.sidebar && node.icon) {
      const { section, order = Number.MAX_SAFE_INTEGER, linkOrder } = node.sidebar
      if (!sectionMap.has(section)) {
        sectionMap.set(section, { title: section, order, links: [] })
      }

      const sectionEntry = sectionMap.get(section)!
      sectionEntry.order = Math.min(sectionEntry.order ?? order, order)

      const link: SidebarLink = {
        title: node.label ?? section,
        to: currentPath,
        icon: node.icon,
        order: linkOrder ?? order,
        end: currentPath === '/',
      }

      sectionEntry.links.push(link)
    }

    const nextBase = node.index ? basePath : currentPath
    if (node.children?.length) {
      node.children?.forEach((child) => traverse(child, nextBase))
    }
  }

  root.children?.forEach((child) => traverse(child, '/'))

  const sections = Array.from(sectionMap.values())
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((section) => ({
      title: section.title,
      order: section.order,
      links: section.links
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(({ order, ...rest }) => rest),
    }))

  return sections
}

function resolveFullPath(basePath: string, route: AppRoute): string {
  if (route.index) {
    return basePath || '/'
  }

  if (!route.path) {
    return basePath || '/'
  }

  const normalizedBase =
    basePath === '/' || basePath === '' ? '' : basePath.replace(/^\/|\/$/g, '')
  const normalizedPath = route.path.replace(/^\//, '')

  return `/${[normalizedBase, normalizedPath].filter(Boolean).join('/')}`
}

export const routeElements = [
  renderRoute(routeConfig, { sidebarSections }),
  renderRoute(authRoute, { sidebarSections }),
]

export { sidebarSections, routeConfig, authRoute }

