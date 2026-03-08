import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getRouteAuth } from '@/lib/auth'
import { getSupabaseServiceRole } from '@/lib/supabase'

export async function POST() {
  try {
    const { user } = await getRouteAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = getSupabaseServiceRole()
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Supabase admin client not available' }, { status: 500 })
    }

    const { data, error } = await admin.auth.admin.listUsers()
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    for (const supabaseUser of data.users) {
      const email = supabaseUser.email
      if (!email) continue

      const fullName =
        (supabaseUser.user_metadata?.full_name as string | undefined) ||
        (supabaseUser.user_metadata?.name as string | undefined) ||
        email

      await prisma.user.upsert({
        where: { authId: supabaseUser.id },
        update: {
          email,
          name: fullName,
        },
        create: {
          authId: supabaseUser.id,
          email,
          name: fullName,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to sync users from Supabase', error)
    return NextResponse.json({ success: false, error: 'Failed to sync users' }, { status: 500 })
  }
}
