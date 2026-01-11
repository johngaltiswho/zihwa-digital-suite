import { NextResponse } from 'next/server'
import { getRouteAuth } from '@/lib/auth'
import { getSupabaseServiceRole } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { user } = await getRouteAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { email, name } = body as { email?: string; name?: string }

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    const admin = getSupabaseServiceRole()
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Supabase admin client not available' }, { status: 500 })
    }

    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      data: name ? { full_name: name } : undefined,
    })

    if (error) {
      console.error('Supabase invite failed', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to invite user', error)
    return NextResponse.json({ success: false, error: 'Failed to invite user' }, { status: 500 })
  }
}
