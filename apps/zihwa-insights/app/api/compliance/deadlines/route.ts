import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const deadlines = await prisma.complianceDeadline.findMany({
      include: { company: { select: { name: true } } },
      orderBy: { dueDate: 'asc' }
    });
    return NextResponse.json(deadlines);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Attempting to save:", body);

    // 1. Ensure we have a creator (User) in the database
    let user = await prisma.user.findFirst();
    
    // Fallback: If no user exists, create a local development user
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "admin@zihwa.com",
          authId: "local_dev_id",
          name: "Local Admin",
          role: "ADMIN"
        }
      });
    }

    // 2. Create the deadline
    const deadline = await prisma.complianceDeadline.create({
      data: {
        title: body.title,
        type: body.type || "OTHER", // Must match ComplianceType enum
        priority: body.priority || "MEDIUM", // Must match Priority enum
        dueDate: new Date(body.dueDate),
        companyId: body.companyId,
        createdById: user.id,
        status: 'PENDING',
      },
      include: { company: true }
    });

    console.log("Success! Saved ID:", deadline.id);
    return NextResponse.json(deadline);
  } catch (error: any) {
    console.error("BACKEND SAVE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}