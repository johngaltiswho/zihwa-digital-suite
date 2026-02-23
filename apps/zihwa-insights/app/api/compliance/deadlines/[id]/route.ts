import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // Change type to Promise
) {
  try {
    const { id } = await params; // Await the params
    const body = await req.json();
    
    const updated = await prisma.complianceDeadline.update({
      where: { id },
      data: {
        status: body.status,
        fileUrl: body.fileUrl, 
        completedAt: body.status === 'COMPLETED' ? new Date() : null,
      }
    });
    
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // Change type to Promise
) {
  try {
    const { id } = await params; // Await the params
    await prisma.complianceDeadline.delete({ where: { id } });
    
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}