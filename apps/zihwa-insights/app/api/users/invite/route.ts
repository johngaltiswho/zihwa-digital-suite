
import { NextResponse } from 'next/server'
import { getRouteAuth } from '@/lib/auth'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { UserRole, CompanyRole } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const { user } = await getRouteAuth()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const {
      email,
      name,
      role = 'CONSULTANT',
      companyId,
      companyRole = 'VIEWER',
    } = body as {
      email?: string
      name?: string
      role?: UserRole
      companyId?: string
      companyRole?: CompanyRole
    }

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    const validRole = Object.values(UserRole).includes(role) ? role : UserRole.CONSULTANT

    const admin = getSupabaseServiceRole()
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Supabase admin client not available' }, { status: 500 })
    }
    // 🔍 TEMP sanity check — REMOVE after verification
const payload = JSON.parse(
  Buffer.from(
    process.env.SUPABASE_SERVICE_ROLE_KEY!.split('.')[1],
    'base64'
  ).toString()
)

console.log('SUPABASE KEY ROLE:', payload.role)

    // Step 1: Send invite email via Supabase
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: name,
        role: validRole,
      },
      // redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    })
    if (error) {
  console.error('=== SUPABASE INVITE ERROR ===')
  console.error('Name:', error.name)
  console.error('Message:', error.message)
  console.error('Status:', error.status)
  // console.error('Details:', error.details)
  console.error('Cause:', error.cause)
  console.error('Raw:', error)
  console.error('============================')
  return NextResponse.json(
    { success: false, error: error.message },
    { status: 400 }
  )
}


    const authId = data.user.id

    // Step 2: Upsert into Prisma users table
    const dbUser = await prisma.user.upsert({
      where: { authId },
      update: {
        name: name ?? email,
        role: validRole,
      },
      create: {
        authId,
        email,
        name: name ?? email,
        role: validRole,
      },
    })

    // Step 3: Assign to company if provided
    if (companyId) {
      const validCompanyRole = Object.values(CompanyRole).includes(companyRole)
        ? companyRole
        : CompanyRole.VIEWER

      await prisma.companyAccess.upsert({
        where: {
          userId_companyId: {
            userId: dbUser.id,
            companyId,
          },
        },
        update: { role: validCompanyRole },
        create: {
          userId: dbUser.id,
          companyId,
          role: validCompanyRole,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: { userId: dbUser.id, email, role: validRole },
    })
  } catch (err) {
    console.error('Failed to invite user', err)
    return NextResponse.json({ success: false, error: 'Failed to invite user' }, { status: 500 })
  }
}