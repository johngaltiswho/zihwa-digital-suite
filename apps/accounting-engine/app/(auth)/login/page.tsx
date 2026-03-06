'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabase } from '../../../components/providers/SupabaseProvider'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginContent() {
  const supabase = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const didRedirectRef = useRef(false)
  const redirectTo = useMemo(
    () => searchParams.get('redirectTo') || '/upload',
    [searchParams]
  )

  useEffect(() => {
    let isMounted = true

    void supabase.auth.getUser().then(({ data }) => {
      if (isMounted && data.user && !didRedirectRef.current) {
        didRedirectRef.current = true
        router.replace(redirectTo)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && !didRedirectRef.current && event === 'SIGNED_IN') {
        didRedirectRef.current = true
        router.replace(redirectTo)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [redirectTo, router, supabase])

  const viewParam = searchParams.get('view')
  const initialView = viewParam === 'sign_up' ? 'sign_up' : 'sign_in'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-sky-700">Zihwa Ledger</p>
          <h1 className="text-2xl font-semibold text-slate-900">Sign in or create an account</h1>
          <p className="text-sm text-slate-600">
            Use your work email. We’ll send a secure magic link via Supabase Auth.
          </p>
        </div>
        <div className="mt-8">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            view={initialView as 'sign_up' | 'sign_in'}
            providers={[]}
            showLinks={false}
          />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <LoginContent />
    </Suspense>
  )
}
