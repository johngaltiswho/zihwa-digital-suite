import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from '../../lib/supabase-server'
import { listOrganizationsForUser } from '@repo/db'
import AppShell from '@/components/shell/AppShell'

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode
}) {
  const { session } = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  const orgs = await listOrganizationsForUser(session.user.id)
  // Do not force a server redirect here; onboarding lives inside this layout
  // and redirecting from /onboarding -> /onboarding can create a client loop.

  return <AppShell>{children}</AppShell>
}
