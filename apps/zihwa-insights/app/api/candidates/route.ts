import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
      include: { company: { select: { id: true, name: true } } }
    })
    return NextResponse.json({ success: true, data: candidates })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const candidate = await prisma.candidate.create({
      data: {
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        designation: body.designation || null,
        experience: body.experience || null,
        qualification: body.qualification || null,
        currentCTC: body.currentCTC || null,
        companyId: body.companyId,
        resumeUrl: body.resumeUrl, // ENSURE THIS IS SAVED
        status: "SCREENING"
      }
    })
    return NextResponse.json({ success: true, data: candidate })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// --- NEW PATCH METHOD FOR STATUS UPDATES ---
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: { status }
    })
    
    return NextResponse.json({ success: true, data: updatedCandidate })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}