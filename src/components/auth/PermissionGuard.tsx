import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { usePermissions, type AccessRequirements } from '@/hooks/use-permissions'
import type { Permission, Role } from '@/types'

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
 * 
 * @example
 * // Require any of the permissions
 * <PermissionGuard permissions={[PERMISSIONS.USERS_EDIT]}>
 *   <EditButton />
 * </PermissionGuard>
 * 
 * @example
 * // Require a specific role
 * <PermissionGuard roles={[ROLES.ADMIN]}>
 *   <AdminPanel />
 * </PermissionGuard>
 * 
 * @example
 * // Hide instead of redirect
 * <PermissionGuard permissions={[PERMISSIONS.USERS_DELETE]} hideOnDenied>
 *   <DeleteButton />
 * </PermissionGuard>
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

  // If hideOnDenied is true, render nothing
  if (hideOnDenied) {
    return null
  }

  // If fallback is provided, render it
  if (fallback !== undefined) {
    return <>{fallback}</>
  }

  // Otherwise redirect
  return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />
}

/**
 * Higher-order component to wrap a component with permission guard
 * 
 * @example
 * const ProtectedPage = withPermissionGuard(MyPage, {
 *   permissions: [PERMISSIONS.USERS_VIEW],
 * })
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

