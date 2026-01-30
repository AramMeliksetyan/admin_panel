import { useMemo } from 'react'
import { useAppSelector } from '@/shared/lib/hooks'
import {
  selectUserPermissions,
  selectUserRoles,
} from '@/features/auth/authSlice'
import type { Permission, Role } from '@/shared/types'

type UsePermissionsReturn = {
  permissions: Permission[]
  roles: Role[]
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
  hasRole: (role: Role) => boolean
  hasAnyRole: (roles: Role[]) => boolean
  canAccess: (requirements: AccessRequirements) => boolean
}

export type AccessRequirements = {
  permissions?: Permission[]
  roles?: Role[]
  requireAll?: boolean // If true, requires all permissions/roles. Default: false (any)
}

/**
 * Hook to check user permissions and roles
 */
export function usePermissions(): UsePermissionsReturn {
  const permissions = useAppSelector(selectUserPermissions)
  const roles = useAppSelector(selectUserRoles)

  const permissionSet = useMemo(() => new Set(permissions), [permissions])
  const roleSet = useMemo(() => new Set(roles), [roles])

  const hasPermission = (permission: Permission): boolean => {
    return permissionSet.has(permission)
  }

  const hasAnyPermission = (perms: Permission[]): boolean => {
    return perms.some((p) => permissionSet.has(p))
  }

  const hasAllPermissions = (perms: Permission[]): boolean => {
    return perms.every((p) => permissionSet.has(p))
  }

  const hasRole = (role: Role): boolean => {
    return roleSet.has(role)
  }

  const hasAnyRole = (roleList: Role[]): boolean => {
    return roleList.some((r) => roleSet.has(r))
  }

  const canAccess = (requirements: AccessRequirements): boolean => {
    const { permissions: reqPerms, roles: reqRoles, requireAll = false } = requirements

    // No requirements means access granted
    if (!reqPerms?.length && !reqRoles?.length) {
      return true
    }

    const hasRequiredPermissions = reqPerms?.length
      ? requireAll
        ? hasAllPermissions(reqPerms)
        : hasAnyPermission(reqPerms)
      : true

    const hasRequiredRoles = reqRoles?.length
      ? requireAll
        ? reqRoles.every((r) => roleSet.has(r))
        : hasAnyRole(reqRoles)
      : true

    return requireAll
      ? hasRequiredPermissions && hasRequiredRoles
      : hasRequiredPermissions || hasRequiredRoles || (!reqPerms?.length && !reqRoles?.length)
  }

  return {
    permissions,
    roles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canAccess,
  }
}

export function useHasPermission(permission: Permission): boolean {
  const { hasPermission } = usePermissions()
  return hasPermission(permission)
}

export function useCanAccess(requirements: AccessRequirements): boolean {
  const { canAccess } = usePermissions()
  return canAccess(requirements)
}
