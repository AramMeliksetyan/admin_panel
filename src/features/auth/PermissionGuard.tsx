import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { usePermissions, type AccessRequirements } from '@/shared/hooks/use-permissions'
import type { Permission, Role } from '@/shared/types'

type PermissionGuardProps = {
  children: ReactNode
  /** Required permissions (any of these) */
  permissions?: Permission[]
  /** Required roles (any of these) */
  roles?: Role[]
  /** If true, requires ALL permissions/roles instead of ANY */
  requireAll?: boolean
  /** Redirect path when access is denied */
  redirectTo?: string
  /** Fallback component to render when access is denied (instead of redirect) */
  fallback?: ReactNode
  /** If true, hide children when access is denied (instead of redirect/fallback) */
  hideOnDenied?: boolean
}

/**
 * Component that guards its children based on permissions/roles
 */
export function PermissionGuard({
  children,
  permissions,
  roles,
  requireAll = false,
  redirectTo = '/unauthorized',
  fallback,
  hideOnDenied = false,
}: PermissionGuardProps) {
  const { canAccess } = usePermissions()
  const location = useLocation()

  const requirements: AccessRequirements = {
    permissions,
    roles,
    requireAll,
  }

  const hasAccess = canAccess(requirements)

  if (hasAccess) {
    return <>{children}</>
  }

  if (hideOnDenied) {
    return null
  }

  if (fallback !== undefined) {
    return <>{fallback}</>
  }

  return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />
}

/**
 * Higher-order component to wrap a component with permission guard
 */
export function withPermissionGuard<P extends object>(
  Component: React.ComponentType<P>,
  guardProps: Omit<PermissionGuardProps, 'children'>
) {
  return function WrappedComponent(props: P) {
    return (
      <PermissionGuard {...guardProps}>
        <Component {...props} />
      </PermissionGuard>
    )
  }
}
