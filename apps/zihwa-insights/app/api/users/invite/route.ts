import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { email, name } = body as { email?: string; name?: string }

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    const res = await fetch('https://api.clerk.com/v1/invitations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        public_metadata: name ? { name } : undefined,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error('Clerk invite failed', data)
      return NextResponse.json(
        { success: false, error: data?.errors?.[0]?.message || 'Failed to send invite' },
        { status: res.status },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to invite user', error)
    return NextResponse.json({ success: false, error: 'Failed to invite user' }, { status: 500 })
  }
}
