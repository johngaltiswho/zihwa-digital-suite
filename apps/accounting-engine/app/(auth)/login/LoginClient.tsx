'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabase } from '../../../components/providers/SupabaseProvider'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type LoginClientProps = {
  redirectTo: string
  initialView: 'sign_in' | 'sign_up'
}

export default function LoginClient({ redirectTo, initialView }: LoginClientProps) {
  const supabase = useSupabase()
  const router = useRouter()
  const didRedirectRef = useRef(false)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && !didRedirectRef.current && event === 'SIGNED_IN') {
        didRedirectRef.current = true
        router.replace(redirectTo)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [redirectTo, router, supabase])

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
            view={initialView}
            providers={[]}
            showLinks={false}
          />
        </div>
      </div>
    </div>
  )
}
