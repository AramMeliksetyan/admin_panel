/**
 * Application Permissions
 * Define all granular permissions in the system
 */
export const PERMISSIONS = {
  // User management
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  USERS_EXPORT: 'users:export',

  // Analytics
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',

  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',

  // Billing
  BILLING_VIEW: 'billing:view',
  BILLING_MANAGE: 'billing:manage',

  // Posts
  POSTS_VIEW: 'posts:view',
  POSTS_CREATE: 'posts:create',
  POSTS_EDIT: 'posts:edit',
  POSTS_DELETE: 'posts:delete',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

/**
 * Application Roles
 * Define all roles in the system
 */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

/**
 * Role-to-Permissions mapping
 * Defines which permissions each role has
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

  [ROLES.ADMIN]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.USERS_EXPORT,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
    PERMISSIONS.BILLING_VIEW,
    PERMISSIONS.POSTS_VIEW,
    PERMISSIONS.POSTS_CREATE,
    PERMISSIONS.POSTS_EDIT,
    PERMISSIONS.POSTS_DELETE,
  ],

  [ROLES.MANAGER]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_EXPORT,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.POSTS_VIEW,
    PERMISSIONS.POSTS_CREATE,
    PERMISSIONS.POSTS_EDIT,
  ],

  [ROLES.EDITOR]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.POSTS_VIEW,
    PERMISSIONS.POSTS_CREATE,
    PERMISSIONS.POSTS_EDIT,
  ],

  [ROLES.VIEWER]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.POSTS_VIEW,
  ],
}

/**
 * Get all permissions for a given role
 */
export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * Get all permissions for multiple roles (union of all permissions)
 */
export function getPermissionsForRoles(roles: Role[]): Permission[] {
  const permissionSet = new Set<Permission>()

  for (const role of roles) {
    const permissions = getPermissionsForRole(role)
    permissions.forEach((p) => permissionSet.add(p))
  }

  return Array.from(permissionSet)
}

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

/**
 * Check if any of the roles has a specific permission
 */
export function rolesHavePermission(roles: Role[], permission: Permission): boolean {
  return roles.some((role) => roleHasPermission(role, permission))
}
