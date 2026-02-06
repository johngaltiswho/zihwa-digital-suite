import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from '../../lib/supabase-server'

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode
}) {
  const { session } = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return <>{children}</>
}
