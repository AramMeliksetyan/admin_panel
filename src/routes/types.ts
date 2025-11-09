import type { ComponentType, ReactElement } from 'react'
import type { LucideIcon } from 'lucide-react'

export type SidebarLink = {
  title: string
  to: string
  icon: LucideIcon
  order?: number
  end?: boolean
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
}

export type RouteContext = {
  sidebarSections: SidebarSection[]
}

