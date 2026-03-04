import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRouteAuth, getCompanyWhereFilter } from '@/lib/auth';
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred'
}
export async function GET() {
  try {
    const { user, dbUser } = await getRouteAuth();
    if (!user || !dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scopeFilter = await getCompanyWhereFilter(dbUser);

    const deadlines = await prisma.complianceDeadline.findMany({
      where: { ...scopeFilter },
      include: { company: { select: { id: true, name: true } } },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json(deadlines);
  } catch (error: unknown) {
    console.error('DEADLINE GET ERROR:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user, dbUser } = await getRouteAuth();
    if (!user || !dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.title || !body.companyId || !body.dueDate) {
      return NextResponse.json(
        { error: 'title, companyId and dueDate are required' },
        { status: 400 }
      );
    }

    const deadline = await prisma.complianceDeadline.create({
      data: {
        title:       body.title,
        description: body.description || null,
        notes:       body.notes       || null,
        type:        body.type        || 'OTHER',
        priority:    body.priority    || 'MEDIUM',
        frequency:   body.frequency   || null,
        dueDate:     new Date(body.dueDate),
        companyId:   body.companyId,
        createdById: dbUser.id,   // ✅ Prisma User.id (cuid), NOT Supabase auth UUID
        status:      'PENDING',
      },
      include: { company: { select: { id: true, name: true } } },
    });

    return NextResponse.json(deadline);
  }  catch (error: unknown) {
    console.error('DEADLINE POST ERROR:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}