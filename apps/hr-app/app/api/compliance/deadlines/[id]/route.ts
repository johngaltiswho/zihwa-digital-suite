import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRouteAuth } from '@/lib/auth';
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred'
}
type DeadlineUpdateData = Parameters<
  typeof prisma.complianceDeadline.update
>[0]['data']
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, dbUser } = await getRouteAuth();
    if (!user || !dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Build update payload dynamically — only include fields that were sent
    const data: DeadlineUpdateData = {};
    if (body.title       !== undefined) data.title       = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.notes       !== undefined) data.notes       = body.notes;
    if (body.companyId   !== undefined) data.companyId   = body.companyId;
    if (body.type        !== undefined) data.type        = body.type;
    if (body.priority    !== undefined) data.priority    = body.priority;
    if (body.frequency   !== undefined) data.frequency   = body.frequency;
    if (body.fileUrl     !== undefined) data.fileUrl     = body.fileUrl;
// companyId goes through the relation connect syntax
    if (body.companyId !== undefined) {
      data.company = { connect: { id: body.companyId } };
    }

    if (body.dueDate !== undefined) {
      data.dueDate = new Date(body.dueDate);
    }

    if (body.status !== undefined) {
      data.status      = body.status;
      data.completedAt = body.status === 'COMPLETED' ? new Date() : null;
    }

    const updated = await prisma.complianceDeadline.update({
      where: { id },
      data,
      include: { company: { select: { id: true, name: true } } },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('DEADLINE PATCH ERROR:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, dbUser } = await getRouteAuth();
    if (!user || !dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.complianceDeadline.delete({ where: { id } });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error: unknown) {
    console.error('DEADLINE DELETE ERROR:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}