'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Building2, Calendar, FileText, Users, Home,HardHat, ChevronLeft, ChevronRight,UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { useEffect, useState as useUserState } from 'react'
import { User } from '@supabase/supabase-js'
const NAV_ITEMS = [
  { href: '/dashboard',               label: 'Home',              icon: Home,      roles: ['ADMIN', 'CONSULTANT', 'ACCOUNTANT', 'HR'] },
  { href: '/dashboard/companies',     label: 'Companies',         icon: Building2, roles: ['ADMIN', 'CONSULTANT', 'ACCOUNTANT', 'HR'] },
  { href: '/dashboard/deadlines',     label: 'Deadlines',         icon: Calendar,  roles: ['ADMIN', 'CONSULTANT', 'ACCOUNTANT', 'HR'] },
  { href: '/dashboard/documents',     label: 'Documents',         icon: FileText,  roles: ['ADMIN', 'CONSULTANT', 'ACCOUNTANT', 'HR'] },
  { href: '/dashboard/employees',     label: 'Employees',         icon: Users,     roles: ['ADMIN', 'CONSULTANT', 'ACCOUNTANT', 'HR'] },
  { href: '/dashboard/labours',       label: 'Labours',           icon: HardHat,   roles: ['ADMIN', 'CONSULTANT', 'ACCOUNTANT', 'HR'] },
  { href: '/dashboard/users',         label: 'Users',             icon: Users,     roles: ['ADMIN', 'HR'] },
  { href: '/dashboard/hiring',        label: 'Hiring Candidates', icon: UserPlus,  roles: ['ADMIN', 'HR'] },
]
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useUserState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [roleLoaded, setRoleLoaded] = useState(false)
  const router = useRouter()
  const supabase = useSupabase()
  
  // Fetch role from API — single source of truth, no cookie dependency
  const fetchRole = async () => {
    try {
      const res = await fetch('/api/users/user')
      if (res.ok) {
        const data = await res.json()
        if (data.role) setUserRole(data.role)
        setRoleLoaded(true)
      }
    } catch {
      // silently fail
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      const params = new URLSearchParams(hash.replace('#', ''))
      const type = params.get('type')
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (type === 'invite' && accessToken && refreshToken) {
        // Clear hash so it doesn't loop
        window.history.replaceState(null, '', window.location.pathname)
        // Send to sign-in with the tokens so user can set password
        router.push(
          `/sign-in#access_token=${accessToken}&refresh_token=${refreshToken}&type=invite`
        )
        return
      }
    }
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) await fetchRole()
    }

    init()

    // Only update user object on auth change, don't re-fetch role
    // (avoids flickering from onAuthStateChange firing with stale state)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newUser = session?.user || null
      setUser(newUser)
      // Only fetch role on actual sign-in events, not on every state change
      if (event === 'SIGNED_IN' && newUser) {
        fetchRole()
      }
      if (event === 'SIGNED_OUT') {
        setUserRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router, setUser])

  const fullName =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email ||
    'Guest User'

  const email = user?.email ?? ''

  
  const handleSignOut = async () => {
    // Clear role cookie on sign out
    document.cookie = 'x-user-role=; path=/; max-age=0'
    document.cookie = 'x-company-scope=; path=/; max-age=0'
    await supabase.auth.signOut()
    router.push('/sign-in')
  }
  

 
// Filter nav items by the user's role
 const visibleNavItems = roleLoaded
  ? NAV_ITEMS.filter(item => item.roles.includes(userRole ?? ''))
  : []
  const pathname = usePathname()
  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`relative ${collapsed ? 'w-20' : 'w-60'} min-h-screen border-r border-gray-100 bg-gray-50/30 transition-all duration-300`}
        >
          <div className="flex items-center justify-between p-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                ZI
              </div>
              {!collapsed && <span className="text-lg font-semibold text-gray-900">Zihwa Insights</span>}
            </Link>
            <button
              type="button"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setCollapsed((prev) => !prev)}
              className="rounded-md border border-gray-200 p-2 text-gray-600 hover:bg-white"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          <nav className="px-3 space-y-1">
          {visibleNavItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors group ${
                collapsed ? 'justify-center' : ''
                } ${
                pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                <Icon className={`h-4 w-4 ${
                pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                ? 'text-gray-700'
                : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                <span className={`${collapsed ? 'sr-only' : 'ml-3'} whitespace-nowrap`}>{label}</span>
              </Link>
            ))}
          </nav>
          {/* Role badge at bottom of sidebar */}
          {!collapsed && userRole && (
            <div className="absolute bottom-6 left-0 right-0 px-4">
              <div className="rounded-md bg-gray-100 px-3 py-2 text-center">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {userRole}
                </span>
              </div>
            </div>
          )}

        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen min-w-0 bg-white">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-8 py-4">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <span className="text-gray-300">/</span>
              <span className="font-semibold text-gray-900">Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{fullName}</p>
                <p className="text-xs text-gray-500">{email || 'Signed in'}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign out
              </button>
            </div>
          </header>
          <div className="w-full px-8 py-8 overflow-x-hidden">{children}</div>
        </main>
      </div>
    </div>
  )
}
