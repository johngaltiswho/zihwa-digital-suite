'use client'

import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'
import { createContext, useContext, useState } from 'react'

const SupabaseContext = createContext<SupabaseClient | null>(null)

export const useSupabase = () => {
  const value = useContext(SupabaseContext)
  if (!value) {
    throw new Error('useSupabase must be used within SupabaseProvider')
  }
  return value
}

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}
