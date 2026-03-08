import { NextRequest, NextResponse } from 'next/server';
import { getVideoUploadById } from '@repo/db';
import { errorResponse } from '@/lib/api-error';
import { requireStudent } from '@/lib/student-sync';
import { processVideoUpload } from '@/lib/video/processor';
import { vendureClient } from '@/lib/vendure/client';
import { GET_ACTIVE_CUSTOMER } from '@/lib/vendure/queries/customer';

interface ActiveCustomer {
  id: string;
  emailAddress: string;
  firstName?: string;
  lastName?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const data = (await vendureClient.request(
      GET_ACTIVE_CUSTOMER,
      {},
      {
        cookie: request.headers.get('cookie') ?? '',
      }
    )) as { activeCustomer: ActiveCustomer | null };

    if (!data.activeCustomer) {
      return errorResponse(401, 'Authentication required', 'AUTH_REQUIRED');
    }

    const student = await requireStudent(data.activeCustomer);
    const body = (await request.json()) as { videoId?: string };

    if (!body.videoId) {
      return errorResponse(400, 'videoId is required', 'INVALID_REQUEST');
    }

    const video = await getVideoUploadById(body.videoId);
    if (!video) {
      return errorResponse(404, 'Video not found', 'NOT_FOUND');
    }

    if (video.studentId !== student.id) {
      return errorResponse(403, 'Unauthorized access to this video', 'UNAUTHORIZED');
    }

    await processVideoUpload(video.id);
    return NextResponse.json({
      success: true,
      videoId: video.id,
      status: 'COMPLETED',
    });
  } catch (error) {
    console.error('Video process error:', error);
    return errorResponse(
      500,
      error instanceof Error ? error.message : 'Failed to process video',
      'SERVER_ERROR'
    );
  }
}
