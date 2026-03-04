import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        company: { 
          select: { id: true, name: true } 
        } 
      }
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
        resumeUrl: body.resumeUrl,
        // Manual additions from dashboard get 'Admin' source
        // Applications from /apply page get their specific source via the public API
        source: body.source || "Admin", 
        status: "SCREENING"
      }
    })
    return NextResponse.json({ success: true, data: candidate })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// --- PATCH METHOD FOR STATUS UPDATES ---
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing ID or Status" }, { status: 400 })
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: { status }
    })
    
    return NextResponse.json({ success: true, data: updatedCandidate })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// --- DELETE METHOD ---
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    await prisma.candidate.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true, message: "Candidate deleted" })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}