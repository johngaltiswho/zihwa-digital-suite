/**
 * Video Status API Route
 * Check processing status and get analysis results
 */

import { NextRequest, NextResponse } from 'next/server';
import { vendureClient } from '@/lib/vendure/client';
import { GET_ACTIVE_CUSTOMER } from '@/lib/vendure/queries/customer';
import { requireStudent } from '@/lib/student-sync';
import { getVideoUploadById, listVideoAnalyses, getAverageScores } from '@repo/db';
import { errorResponse } from '@/lib/api-error';

interface ActiveCustomer {
  id: string;
  emailAddress: string;
  firstName?: string;
  lastName?: string;
}

interface AverageScores {
  avgFormScore: number;
  avgPositioningScore: number;
  count: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    // 1. Check authentication
    const data = (await vendureClient.request(
      GET_ACTIVE_CUSTOMER,
      {},
      {
        cookie: request.headers.get('cookie') ?? '',
      }
    )) as { activeCustomer: ActiveCustomer | null };
    const { activeCustomer } = data;

    if (!activeCustomer) {
      return errorResponse(401, 'Authentication required', 'AUTH_REQUIRED');
    }

    // 2. Get student
    const student = await requireStudent(activeCustomer);

    // 3. Get video upload
    const video = await getVideoUploadById(id);

    if (!video) {
      return errorResponse(404, 'Video not found', 'NOT_FOUND');
    }

    // 4. Verify ownership
    if (video.studentId !== student.id) {
      return errorResponse(403, 'Unauthorized access to this video', 'UNAUTHORIZED');
    }

    // 5. Get analyses if completed
    let analyses: Awaited<ReturnType<typeof listVideoAnalyses>> = [];
    let averageScores: AverageScores | null = null;

    if (video.status === 'COMPLETED') {
      analyses = await listVideoAnalyses(id);
      averageScores = await getAverageScores(id);
    }

    // 6. Return status
    return NextResponse.json({
      video: {
        id: video.id,
        fileName: video.fileName,
        fileUrl: video.fileUrl,
        status: video.status,
        uploadedAt: video.uploadedAt,
        processingStartedAt: video.processingStartedAt,
        processingCompletedAt: video.processingCompletedAt,
      },
      analyses: analyses.map((a) => ({
        id: a.id,
        frameNumber: a.frameNumber,
        timestamp: a.timestamp,
        frameUrl: a.frameUrl,
        formScore: a.formScore,
        positioningScore: a.positioningScore,
        feedback: a.feedback,
        strengths: a.strengths,
        improvements: a.improvements,
      })),
      summary: averageScores,
    });
  } catch (error) {
    console.error('Video status check error:', error);
    return errorResponse(
      500,
      error instanceof Error ? error.message : 'Failed to check video status',
      'SERVER_ERROR'
    );
  }
}
