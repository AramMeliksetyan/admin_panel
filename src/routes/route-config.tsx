/**
 * =============================================================================
 * ROUTE CONFIGURATION
 * =============================================================================
 * 
 * This file is the central routing configuration for the application.
 * It defines all routes, their components, access controls, and sidebar navigation.
 * 
 * KEY CONCEPTS:
 * 
 * 1. AppRoute - A declarative route definition that includes:
 *    - Path and component information
 *    - Sidebar metadata (icon, label, section)
 *    - Access control (permissions, roles)
 * 
 * 2. Route Tree - Routes are organized in a tree structure:
 *    - Root route (/) wraps everything in AuthGuard + DashboardLayout
 *    - Child routes are nested and inherit parent layouts
 *    - Auth routes (/auth/*) are separate and public
 * 
 * 3. Permission-Based Access:
 *    - Routes can specify required permissions/roles
 *    - PermissionGuard automatically wraps protected routes
 *    - Sidebar links are filtered based on user permissions
 * 
 * =============================================================================
 */

import { Outlet, Route } from 'react-router-dom'
import { User } from 'lucide-react'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { PermissionGuard } from '@/components/auth/PermissionGuard'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AuthLayout } from '@/pages/auth/AuthLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { UnauthorizedPage } from '@/pages/UnauthorizedPage'
import type {
  AppRoute,
  RouteContext,
  SidebarLink,
  SidebarSection,
} from '@/routes/types'
import { UsersPage } from '@/pages/users'
import { PERMISSIONS } from '@/types'

// =============================================================================
// MAIN APP ROUTES (Protected - requires authentication)
// =============================================================================

/**
 * Main application route configuration.
 * 
 * This is the root route that wraps all authenticated pages.
 * - Wrapped in AuthGuard: redirects to login if not authenticated
 * - Uses DashboardLayout: provides sidebar navigation
 * - Children routes are rendered inside the layout's <Outlet />
 */
const routeConfig: AppRoute = {
  id: 'root',
  path: '/',
  // Element can be a function that receives RouteContext (sidebar sections, etc.)
  element: ({ sidebarSections }) => (
    <AuthGuard>
      <DashboardLayout sections={sidebarSections} />
    </AuthGuard>
  ),
  children: [
    {
      id: 'users',
      index: true, // This is the default route when visiting "/"
      label: 'Users',
      icon: User, // Icon displayed in sidebar
      component: UsersPage,
      sidebar: { section: 'Users', order: 1, linkOrder: 1 }, // Sidebar placement
      access: {
        permissions: [PERMISSIONS.USERS_VIEW], // Required permission to view
      },
    },
    {
      id: 'users-alias',
      path: 'users', // Alternative path: "/users" (same page as index)
      component: UsersPage,
      access: {
        permissions: [PERMISSIONS.USERS_VIEW],
      },
    },
    {
      id: 'unauthorized',
      path: 'unauthorized', // Shown when user lacks permissions
      component: UnauthorizedPage,
      // No access control - everyone can see the unauthorized page
    },
  ],
}

// =============================================================================
// AUTH ROUTES (Public - no authentication required)
// =============================================================================

/**
 * Authentication route configuration.
 * 
 * These routes are public and use a separate AuthLayout.
 * Users are redirected here when not authenticated.
 */
const authRoute: AppRoute = {
  id: 'auth',
  path: 'auth',
  element: <AuthLayout />,
  children: [
    {
      id: 'auth-login',
      path: 'login', // "/auth/login"
      component: LoginPage,
    },
    {
      id: 'auth-register',
      path: 'register', // "/auth/register"
      component: RegisterPage,
    },
    {
      id: 'auth-forgot',
      path: 'forgot-password', // "/auth/forgot-password"
      component: ForgotPasswordPage,
    },
  ],
}

// Build sidebar sections from the route configuration
// This is called once at module load time
const sidebarSections = buildSidebarSections(routeConfig)

// =============================================================================
// ROUTE RENDERING FUNCTIONS
// =============================================================================

/**
 * Recursively renders an AppRoute and its children into React Router <Route> elements.
 * 
 * This function transforms our declarative AppRoute configuration into the actual
 * <Route> components that React Router needs.
 * 
 * @param route - The AppRoute configuration to render
 * @param context - Shared context (sidebar sections, etc.) passed to route elements
 * @returns A React Router <Route> element with nested children
 * 
 * @example
 * // Input AppRoute:
 * { id: 'users', path: 'users', component: UsersPage, children: [...] }
 * 
 * // Output:
 * <Route path="users" element={<UsersPage />}>
 *   {/* rendered children *\/}
 * </Route>
 */
function renderRoute(route: AppRoute, context: RouteContext) {
  // Recursively render all child routes first
  const children = route.children?.map((child) => renderRoute(child, context))

  // Index routes (default routes) use React Router's "index" prop
  if (route.index) {
    return <Route key={route.id} index element={resolveElement(route, context)} />
  }

  // Regular routes with a path
  return (
    <Route key={route.id} path={route.path} element={resolveElement(route, context)}>
      {children}
    </Route>
  )
}

/**
 * Wraps a route element with PermissionGuard if access control is defined.
 * 
 * This function checks if the route has an `access` property and, if so,
 * wraps the element in a PermissionGuard that will:
 * - Check if the user has the required permissions/roles
 * - Redirect to /unauthorized (or custom path) if access is denied
 * 
 * @param element - The React element to potentially wrap
 * @param route - The route configuration containing access control settings
 * @returns The original element or a PermissionGuard-wrapped version
 * 
 * @example
 * // Route with access control:
 * { component: UsersPage, access: { permissions: ['users:view'] } }
 * 
 * // Results in:
 * <PermissionGuard permissions={['users:view']}>
 *   <UsersPage />
 * </PermissionGuard>
 */
function wrapWithPermissionGuard(element: React.ReactElement, route: AppRoute) {
  // No access control defined - return element as-is
  if (!route.access) {
    return element
  }

  // Extract access control configuration
  const { permissions, roles, requireAll, redirectTo } = route.access

  // Wrap element with PermissionGuard
  return (
    <PermissionGuard
      permissions={permissions}   // Required permissions (any match = access granted)
      roles={roles}               // Required roles (any match = access granted)
      requireAll={requireAll}     // If true, ALL permissions/roles must match
      redirectTo={redirectTo}     // Custom redirect path (default: /unauthorized)
    >
      {element}
    </PermissionGuard>
  )
}

/**
 * Resolves what element to render for a given route.
 * 
 * Routes can define their content in three ways (checked in order):
 * 1. `element` - A React element or a factory function
 * 2. `component` - A React component to instantiate
 * 3. `children` - If has children, render an <Outlet /> for nested routing
 * 
 * After resolving, the element is optionally wrapped with PermissionGuard
 * if the route has access control defined.
 * 
 * @param route - The route configuration
 * @param context - Shared context passed to element factory functions
 * @returns The resolved and potentially permission-wrapped element
 * @throws Error if route has no element, component, or children
 * 
 * @example
 * // Using element factory (receives context):
 * { element: ({ sidebarSections }) => <Layout sections={sidebarSections} /> }
 * 
 * // Using component:
 * { component: UsersPage }
 * 
 * // Parent with children (renders Outlet):
 * { children: [...] }
 */
function resolveElement(route: AppRoute, context: RouteContext) {
  // Option 1: Element factory function - call it with context
  if (typeof route.element === 'function') {
    return wrapWithPermissionGuard(route.element(context), route)
  }

  // Option 2: Direct React element
  if (route.element) {
    return wrapWithPermissionGuard(route.element, route)
  }

  // Option 3: Component to instantiate
  if (route.component) {
    const Component = route.component
    return wrapWithPermissionGuard(<Component />, route)
  }

  // Option 4: Parent route with children - render Outlet for nested routing
  // Note: Outlets are not wrapped with PermissionGuard (children handle their own access)
  if (route.children?.length) {
    return <Outlet />
  }

  // No valid element configuration found
  throw new Error(`Route "${route.id}" is missing an element or component`)
}

// =============================================================================
// SIDEBAR GENERATION FUNCTIONS
// =============================================================================

/**
 * Builds sidebar navigation sections from the route configuration.
 * 
 * This function traverses the route tree and extracts routes that have
 * `sidebar` metadata defined, organizing them into sections for display.
 * 
 * HOW IT WORKS:
 * 1. Recursively traverses all routes starting from root's children
 * 2. For each route with `sidebar` and `icon` defined:
 *    - Creates or updates a section (grouped by section name)
 *    - Adds a link with title, path, icon, and access control info
 * 3. Sorts sections and links by their `order` property
 * 4. Returns the organized sections for the Sidebar component
 * 
 * @param root - The root AppRoute to extract sidebar info from
 * @returns Array of SidebarSection objects for the Sidebar component
 * 
 * @example
 * // Route with sidebar metadata:
 * {
 *   id: 'users',
 *   path: 'users',
 *   label: 'Users',
 *   icon: User,
 *   sidebar: { section: 'Management', order: 1, linkOrder: 1 },
 *   access: { permissions: ['users:view'] }
 * }
 * 
 * // Results in:
 * [{
 *   title: 'Management',
 *   order: 1,
 *   links: [{
 *     title: 'Users',
 *     to: '/users',
 *     icon: User,
 *     permissions: ['users:view']  // Used by Sidebar to filter links
 *   }]
 * }]
 */
function buildSidebarSections(root: AppRoute): SidebarSection[] {
  // Map to collect sections by their title
  const sectionMap = new Map<string, SidebarSection>()

  /**
   * Recursive traversal function.
   * Walks through the route tree, collecting sidebar-enabled routes.
   */
  const traverse = (node: AppRoute, basePath: string) => {
    // Calculate the full path for this route
    const currentPath = resolveFullPath(basePath, node)

    // Only process routes that have sidebar metadata AND an icon
    if (node.sidebar && node.icon) {
      const { section, order = Number.MAX_SAFE_INTEGER, linkOrder } = node.sidebar
      
      // Create section if it doesn't exist
      if (!sectionMap.has(section)) {
        sectionMap.set(section, { title: section, order, links: [] })
      }

      // Update section order to be the minimum of all its routes
      const sectionEntry = sectionMap.get(section)!
      sectionEntry.order = Math.min(sectionEntry.order ?? order, order)

      // Create the sidebar link
      const link: SidebarLink = {
        title: node.label ?? section,      // Display text (fallback to section name)
        to: currentPath,                    // Navigation path
        icon: node.icon,                    // Lucide icon component
        order: linkOrder ?? order,          // Sort order within section
        end: currentPath === '/',           // Exact match for NavLink (root path only)
        // Include access control info - Sidebar uses this to filter links
        // based on current user's permissions
        permissions: node.access?.permissions,
        roles: node.access?.roles,
      }

      sectionEntry.links.push(link)
    }

    // Continue traversal to children
    // For index routes, keep the same base path; otherwise use current path
    const nextBase = node.index ? basePath : currentPath
    if (node.children?.length) {
      node.children?.forEach((child) => traverse(child, nextBase))
    }
  }

  // Start traversal from root's children (root itself isn't in sidebar)
  root.children?.forEach((child) => traverse(child, '/'))

  // Convert map to sorted array
  const sections = Array.from(sectionMap.values())
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))  // Sort sections by order
    .map((section) => ({
      title: section.title,
      order: section.order,
      links: section.links
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))  // Sort links within section
        .map(({ order, ...rest }) => rest),  // Remove internal order property
    }))

  return sections
}

/**
 * Resolves the full URL path for a route, combining base path with route path.
 * 
 * This handles the path resolution logic for nested routes:
 * - Index routes return the base path (they're the default at that level)
 * - Regular routes combine base + route path with proper slash handling
 * 
 * @param basePath - The parent route's path (e.g., "/settings")
 * @param route - The current route being processed
 * @returns The full path for this route (e.g., "/settings/profile")
 * 
 * @example
 * resolveFullPath('/settings', { path: 'profile' })  // => '/settings/profile'
 * resolveFullPath('/', { index: true })              // => '/'
 * resolveFullPath('/admin', { path: 'users' })       // => '/admin/users'
 */
function resolveFullPath(basePath: string, route: AppRoute): string {
  // Index routes inherit their parent's path
  if (route.index) {
    return basePath || '/'
  }

  // Routes without a path also inherit parent's path
  if (!route.path) {
    return basePath || '/'
  }

  // Normalize paths: remove leading/trailing slashes for consistent joining
  const normalizedBase =
    basePath === '/' || basePath === '' ? '' : basePath.replace(/^\/|\/$/g, '')
  const normalizedPath = route.path.replace(/^\//, '')

  // Join paths with a leading slash
  return `/${[normalizedBase, normalizedPath].filter(Boolean).join('/')}`
}

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * The rendered Route elements ready to be used in React Router's <Routes>.
 * 
 * This array contains all the application routes converted to React Router
 * <Route> elements. Used in app-routes.tsx to set up the router.
 * 
 * @example
 * // In app-routes.tsx:
 * <Routes>
 *   {routeElements}
 * </Routes>
 */
export const routeElements = [
  renderRoute(routeConfig, { sidebarSections }),
  renderRoute(authRoute, { sidebarSections }),
]

/**
 * Export the raw configuration and sidebar sections for use elsewhere.
 * 
 * - sidebarSections: Used by DashboardLayout to render navigation
 * - routeConfig: The main app routes (useful for testing/debugging)
 * - authRoute: The authentication routes
 */
export { sidebarSections, routeConfig, authRoute }

