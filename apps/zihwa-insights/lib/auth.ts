import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

// Simple server-side Supabase client
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

async function syncUserProfile(user: User) {
  if (!user.email) {
    throw new Error('Authenticated user is missing an email address')
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email

  const existingByAuth = await prisma.user.findUnique({
    where: { authId: user.id },
  })

  if (existingByAuth) {
    return prisma.user.update({
      where: { id: existingByAuth.id },
      data: {
        email: user.email,
        name: displayName,
      },
    })
  }

  const existingByEmail = await prisma.user.findUnique({
    where: { email: user.email },
  })

  if (existingByEmail) {
    return prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        authId: user.id,
        email: user.email,
        name: displayName,
      },
    })
  }

  return prisma.user.create({
    data: {
      authId: user.id,
      email: user.email,
      name: displayName,
      role: UserRole.CONSULTANT,
    },
  })
}

// Simple auth helper for server components
export async function getServerAuth() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, dbUser: null }
  }

  const dbUser = await syncUserProfile(user)
  return { user, dbUser }
}

// Simple auth helper for API routes  
export async function getRouteAuth() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, dbUser: null }
  }

  const dbUser = await syncUserProfile(user)
  return { user, dbUser }
}
