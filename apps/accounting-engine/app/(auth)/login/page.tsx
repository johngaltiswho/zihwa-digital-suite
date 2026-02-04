'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabase } from '../../../components/providers/SupabaseProvider'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const supabase = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const redirectTo = searchParams.get('redirectTo') || '/upload'
        router.replace(redirectTo)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, searchParams, supabase])

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
