// app/api/users/user/route.ts


import { NextResponse } from 'next/server'
import { getRouteAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { user, dbUser } = await getRouteAuth()

    if (!user || !dbUser) {
      return NextResponse.json({ role: null, companyScope: null }, { status: 401 })
    }

    
    let companyScope = 'ALL'

    if (dbUser.role === 'ACCOUNTANT') {
      const accesses = await prisma.companyAccess.findMany({
        where: { userId: dbUser.id },
        select: { companyId: true },
      })
      companyScope = accesses.map((a) => a.companyId).join(',')
    }

    return NextResponse.json({
      role: dbUser.role,
      companyScope,
    })
  } catch (error) {
    console.error('Error fetching user role:', error)
    return NextResponse.json({ role: null, companyScope: null }, { status: 500 })
  }
}