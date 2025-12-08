'use client'

import { useState } from 'react'
import { UserButton, useUser } from '@clerk/nextjs'
import { Building2, Calendar, FileText, Users, Home, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useUser()

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/dashboard/companies', label: 'Companies', icon: Building2 },
    { href: '/dashboard/deadlines', label: 'Deadlines', icon: Calendar },
    { href: '/dashboard/documents', label: 'Documents', icon: FileText },
    { href: '/dashboard/employees', label: 'Employees', icon: Users },
    { href: '/dashboard/users', label: 'Users', icon: Users },
    { href: '/dashboard/vendor-payments', label: 'Vendor Payments', icon: CreditCard },
  ]

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
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors group text-gray-600 hover:text-gray-900 hover:bg-gray-50 ${
                  collapsed ? 'justify-center' : ''
                }`}
              >
                <Icon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                <span className={`${collapsed ? 'sr-only' : 'ml-3'} whitespace-nowrap`}>{label}</span>
              </Link>
            ))}
          </nav>

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
                <p className="text-sm font-semibold text-gray-900">{user?.fullName ?? 'Guest User'}</p>
                <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress ?? 'Signed in'}</p>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>
          <div className="w-full px-8 py-8 overflow-x-hidden">{children}</div>
        </main>
      </div>
    </div>
  )
}
