'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabase } from '@/components/providers/SupabaseProvider'

type AuthView = 'sign_in' | 'sign_up' | 'forgotten_password' | 'update_password'

export default function SignInPage() {
  const supabase = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [view, setView] = useState<AuthView | undefined>(
    (searchParams?.get('view') as AuthView) ?? undefined
  )
  const nextRoute = searchParams?.get('redirectedFrom') || '/dashboard'
  const redirectTo = useMemo(
    () => (typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined),
    [],
  )

  // Detect password recovery from URL hash or query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      const hasRecoveryInHash = hash.includes('type=recovery')
      const hasRecoveryInQuery = searchParams?.get('type') === 'recovery'
      const hasCode = searchParams?.get('code') // Supabase sends recovery with ?code= param

      if (hasRecoveryInHash || hasRecoveryInQuery || hasCode) {
        console.log('Recovery detected:', { hasRecoveryInHash, hasRecoveryInQuery, hasCode })
        setView('update_password')
        return
      }
    }
    const urlView = searchParams?.get('view') as AuthView | null
    if (urlView) setView(urlView)
  }, [searchParams])

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push(nextRoute)
      }
    })

    return () => data.subscription.unsubscribe()
  }, [nextRoute, router, supabase])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white text-xl font-semibold">
            ZI
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Zihwa Insights</h1>
          <p className="text-gray-500 text-sm">Secure sign-in and password management powered by Supabase.</p>
        </div>

        <Auth
          supabaseClient={supabase}
          view={view}
          redirectTo={redirectTo}
          providers={[]}
          magicLink={false}
          showLinks
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#111827',
                  brandAccent: '#0f172a',
                },
              },
            },
            className: {
              button: 'bg-gray-900 hover:bg-gray-800 text-white',
              anchor: 'text-gray-900 font-semibold',
              input: 'rounded-lg border-gray-200 focus:border-gray-900 focus:ring-0',
            },
          }}
        />
      </div>
    </div>
  )
}
