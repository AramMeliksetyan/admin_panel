import type { ComponentType, ReactElement } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { Permission, Role } from '@/types'

export type SidebarLink = {
  title: string
  to: string
  icon: LucideIcon
  order?: number
  end?: boolean
  permissions?: Permission[]
  roles?: Role[]
}

export type SidebarSection = {
  title: string
  links: SidebarLink[]
  order?: number
}

export type SidebarMeta = {
  section: string
  order?: number
  linkOrder?: number
}

export type RouteElementFactory = (context: RouteContext) => ReactElement

/**
 * Access control configuration for a route
 */
export type RouteAccessControl = {
  /** Required permissions to access this route (any of these) */
  permissions?: Permission[]
  /** Required roles to access this route (any of these) */
  roles?: Role[]
  /** If true, requires ALL permissions/roles instead of ANY */
  requireAll?: boolean
  /** Custom redirect path when access is denied (default: /unauthorized) */
  redirectTo?: string
}

export type AppRoute = {
  id: string
  label?: string
  icon?: LucideIcon
  path?: string
  index?: boolean
  component?: ComponentType
  element?: ReactElement | RouteElementFactory
  children?: AppRoute[]
  sidebar?: SidebarMeta
  /** Access control configuration for this route */
  access?: RouteAccessControl
}

export type RouteContext = {
  sidebarSections: SidebarSection[]
}

