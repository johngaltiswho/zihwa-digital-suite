import { redirect } from 'next/navigation'
import { getServerSession } from '../../../lib/supabase-server'
import LoginClient from './LoginClient'

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function getStringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {}
  const requestedRedirect = getStringParam(params.redirectTo) || '/upload'
  const viewParam = getStringParam(params.view)
  const initialView = viewParam === 'sign_up' ? 'sign_up' : 'sign_in'

  const { user } = await getServerSession()

  if (user) {
    redirect(requestedRedirect)
  }

  return <LoginClient redirectTo={requestedRedirect} initialView={initialView} />
}
