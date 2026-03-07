'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabase } from '@/components/providers/SupabaseProvider'

export default function ResetPasswordPage() {
  const supabase = useSupabase()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [readyForPasswordUpdate, setReadyForPasswordUpdate] = useState(false)

  const redirectTo = useMemo(
    () => (typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined),
    [],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const bootstrapRecoverySession = async () => {
      const hash = window.location.hash
      const hashParams = new URLSearchParams(hash.replace('#', ''))
      const type = hashParams.get('type')
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')

      if ((type === 'recovery' || type === 'invite') && accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (sessionError) {
          setError('This reset link is invalid or has expired. Please request a new one.')
          return
        }

        // Remove sensitive tokens from URL
        window.history.replaceState(null, '', window.location.pathname)
        return
      }

      const queryParams = new URLSearchParams(window.location.search)
      const code = queryParams.get('code')
      const tokenHash = queryParams.get('token_hash')
      const queryType = queryParams.get('type')

      if (code) {
        const { error: codeError } = await supabase.auth.exchangeCodeForSession(code)
        if (codeError) {
          setError('This reset link is invalid or has expired. Please request a new one.')
          return
        }
      } else if (tokenHash && queryType === 'recovery') {
        const { error: otpError } = await supabase.auth.verifyOtp({
          type: 'recovery',
          token_hash: tokenHash,
        })

        if (otpError) {
          setError('This reset link is invalid or has expired. Please request a new one.')
          return
        }
      }

      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        setError('This reset link is invalid or has expired. Please request a new one.')
        return
      }

      setReadyForPasswordUpdate(true)
    }

    bootstrapRecoverySession()
  }, [supabase])

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'USER_UPDATED') {
        router.push('/dashboard')
      }
    })

    return () => data.subscription.unsubscribe()
  }, [router, supabase])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-8 space-y-2 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-xl font-semibold text-white">
            ZI
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Reset your password</h1>
          <p className="text-sm text-gray-500">Enter a new password to continue.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {readyForPasswordUpdate ? (
          <Auth
            supabaseClient={supabase}
            view="update_password"
            redirectTo={redirectTo}
            providers={[]}
            magicLink={false}
            showLinks={false}
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
                input: 'rounded-lg border-gray-200 focus:border-gray-900 focus:ring-0',
              },
            }}
          />
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            Validating reset link...
          </div>
        )}
      </div>
    </div>
  )
}
