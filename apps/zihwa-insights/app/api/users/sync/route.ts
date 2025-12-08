import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

type ClerkUser = {
  id: string
  first_name: string | null
  last_name: string | null
  email_addresses: { email_address: string }[]
}

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const res = await fetch('https://api.clerk.com/v1/users?limit=200', {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, error: err?.errors?.[0]?.message || 'Failed to fetch Clerk users' },
        { status: res.status },
      )
    }

    const users = (await res.json()) as ClerkUser[]

    for (const clerkUser of users) {
      const email = clerkUser.email_addresses?.[0]?.email_address
      if (!email) continue

      await prisma.user.upsert({
        where: { clerkId: clerkUser.id },
        update: {
          email,
          name: [clerkUser.first_name, clerkUser.last_name].filter(Boolean).join(' ') || null,
        },
        create: {
          clerkId: clerkUser.id,
          email,
          name: [clerkUser.first_name, clerkUser.last_name].filter(Boolean).join(' ') || null,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to sync users from Clerk', error)
    return NextResponse.json({ success: false, error: 'Failed to sync users' }, { status: 500 })
  }
}
