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
  const [inviteProcessed, setInviteProcessed] = useState(false)
  const nextRoute = searchParams?.get('redirectedFrom') || '/dashboard'
  const redirectTo = useMemo(
    () => (typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined),
    [],
  )

  // Handle invite + recovery tokens from URL hash
  useEffect(() => {
    if (typeof window === 'undefined') return

    const hash = window.location.hash
    const params = new URLSearchParams(hash.replace('#', ''))
    const type = params.get('type')
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    const handleInvite = async () => {
      if ((type === 'invite' || type === 'recovery') && accessToken && refreshToken) {
        // Exchange tokens to create a session
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (!error) {
          // Clear the hash from URL
          window.history.replaceState(null, '', window.location.pathname)
          // Show update_password view so user sets their password
          setView('update_password')
          setInviteProcessed(true)
        }
        return
      }

      // Handle ?code= param (PKCE flow)
      const code = searchParams?.get('code')
      const queryType = searchParams?.get('type')

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
          if (queryType === 'recovery') {
            setView('update_password')
            setInviteProcessed(true)
          } else {
            // Regular code exchange — go to dashboard
            router.push('/dashboard')
          }
        }
        return
      }

      // Check query params for explicit view
      const urlView = searchParams?.get('view') as AuthView | null
      if (urlView) {
        setView(urlView)
        return
      }

      // Default recovery detection
      const hasRecoveryInHash = hash.includes('type=recovery')
      const hasRecoveryInQuery = searchParams?.get('type') === 'recovery'
      if (hasRecoveryInHash || hasRecoveryInQuery) {
        setView('update_password')
      }
    }

    handleInvite()
  }, [searchParams, supabase, router])

  // After password is updated → redirect to dashboard
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' && !inviteProcessed) {
        router.push(nextRoute)
      }
      if (event === 'USER_UPDATED') {
        // Password was set/updated — go to dashboard
        router.push('/dashboard')
      }
    })
    

    return () => data.subscription.unsubscribe()
  }, [nextRoute, router, supabase, inviteProcessed])
  // 3. INJECT SHOW/HIDE PASSWORD ICON (Bulletproof version)
  useEffect(() => {
    const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`
    const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`

    const addPasswordToggle = () => {
      // Find all password inputs, including ones we've already converted
      const inputs = document.querySelectorAll('input[type="password"], input[data-is-password="true"]')

      inputs.forEach((input) => {
        // Tag it so we don't lose it when type changes to 'text'
        if (!input.getAttribute('data-is-password')) {
          input.setAttribute('data-is-password', 'true')
        }

        const parent = input.parentElement
        if (!parent) return

        // Prevent adding multiple buttons if we already processed this input
        if (parent.querySelector('.password-toggle')) return

        parent.style.position = 'relative'

        const btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'password-toggle'
        btn.innerHTML = input.getAttribute('type') === 'password' ? eyeIcon : eyeOffIcon
        
          Object.assign(btn.style, {
          position: 'absolute',
          right: '12px',
          bottom: '10px', 
          background: 'transparent',
          border: 'none',
          color: '#6b7280',
          cursor: 'pointer',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '10'
        })

        btn.onclick = (e) => {
          e.preventDefault()
          const currentType = input.getAttribute('type')
          const newType = currentType === 'password' ? 'text' : 'password'
          input.setAttribute('type', newType)
          // SWAPPED HERE TOO
          btn.innerHTML = newType === 'password' ? eyeOffIcon : eyeIcon
        
        }

        parent.appendChild(btn)
      })
    }

    // Run it once immediately
    addPasswordToggle()

    // Create a relentless observer that fires whenever Supabase changes ANY part of the DOM
    const observer = new MutationObserver(() => {
      addPasswordToggle()
    })

    // Observe the entire document body
    observer.observe(document.body, { childList: true, subtree: true })

    // Cleanup when leaving the page entirely
    return () => observer.disconnect()
  }, []) // <-- Empty dependency array means this observer STAYS ACTIVE through view changes

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white text-xl font-semibold">
            ZI
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Zihwa Insights</h1>
          {/* Dynamic subtitle based on view */}
          {view === 'update_password' ? (
            <div className="space-y-1">
              <p className="text-gray-900 font-medium">Set your password</p>
              <p className="text-gray-500 text-sm">Choose a password to activate your account.</p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Secure sign-in and password management powered by Supabase.
            </p>
          )}
        </div>

        <Auth
          supabaseClient={supabase}
          view={view}
          redirectTo={redirectTo}
          providers={[]}
          magicLink={false}
          showLinks={view !== 'update_password'}
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
