
import { NextResponse } from 'next/server'
import { getRouteAuth } from '@/lib/auth'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { UserRole, CompanyRole, Prisma } from '@prisma/client'

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

    // Step 2: Upsert into Prisma users table without breaking on existing email
    const existingByAuthId = await prisma.user.findUnique({ where: { authId } })
    const existingByEmail = await prisma.user.findUnique({ where: { email } })

    let dbUser
    if (existingByAuthId) {
      dbUser = await prisma.user.update({
        where: { id: existingByAuthId.id },
        data: {
          email,
          name: name ?? email,
          role: validRole,
        },
      })
    } else if (existingByEmail) {
      dbUser = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          authId,
          name: name ?? email,
          role: validRole,
        },
      })
    } else {
      dbUser = await prisma.user.create({
        data: {
          authId,
          email,
          name: name ?? email,
          role: validRole,
        },
      })
    }

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
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email.' },
        { status: 409 }
      )
    }
    console.error('Failed to invite user', err)
    return NextResponse.json({ success: false, error: 'Failed to invite user' }, { status: 500 })
  }
}
