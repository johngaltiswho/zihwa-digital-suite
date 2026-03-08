import { NextResponse } from 'next/server'
import { getRouteAuth } from '@/lib/auth'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { user } = await getRouteAuth()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { email } = (await request.json()) as { email?: string }
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    const admin = getSupabaseServiceRole()
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Supabase admin client not available' }, { status: 500 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email },
      select: { authId: true, name: true, role: true },
    })

    if (!dbUser?.authId) {
      return NextResponse.json(
        { success: false, error: 'User not found. Send a fresh invite first.' },
        { status: 404 }
      )
    }

    const { data: userData, error: fetchError } = await admin.auth.admin.getUserById(dbUser.authId)
    if (fetchError || !userData?.user) {
      return NextResponse.json({ success: false, error: 'Unable to load invite status' }, { status: 400 })
    }

    if (userData.user.email_confirmed_at) {
      return NextResponse.json(
        { success: false, error: 'User already accepted invite. Use password reset instead.' },
        { status: 400 }
      )
    }

    const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: dbUser.name,
        role: dbUser.role,
      },
    })

    if (inviteError) {
      return NextResponse.json({ success: false, error: inviteError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to resend invite', error)
    return NextResponse.json({ success: false, error: 'Failed to resend invite' }, { status: 500 })
  }
}
