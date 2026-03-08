/**
 * Video Upload API Route
 * Handles video uploads for Humility DB with auth and subscription checks
 */

import { NextRequest, NextResponse } from 'next/server';
import { vendureClient } from '@/lib/vendure/client';
import { GET_ACTIVE_CUSTOMER } from '@/lib/vendure/queries/customer';
import { requireStudent } from '@/lib/student-sync';
import { uploadVideo } from '@/lib/supabase';
import { createVideoUpload, countVideoUploadsInMonth } from '@repo/db';
import { checkSubscription, getVideoUploadLimit } from '@/lib/vendure/subscription';
import { errorResponse } from '@/lib/api-error';
import { processVideoUpload } from '@/lib/video/processor';

interface ActiveCustomer {
  id: string;
  emailAddress: string;
  firstName?: string;
  lastName?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
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

    // 2. Get or create student record
    const student = await requireStudent(activeCustomer);

    // 3. Check subscription and upload limits
    const subscription = await checkSubscription(activeCustomer.id, {
      cookie: request.headers.get('cookie') ?? '',
    });

    if (!subscription.isActive) {
      return errorResponse(
        403,
        'Active subscription required to upload videos',
        'SUBSCRIPTION_REQUIRED'
      );
    }

    // Check monthly upload limit based on tier
    const uploadLimit = getVideoUploadLimit(subscription.tier);

    if (uploadLimit !== -1) {
      // -1 means unlimited
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const uploadsThisMonth = await countVideoUploadsInMonth(
        student.id,
        startOfMonth,
        endOfMonth
      );

      if (uploadsThisMonth >= uploadLimit) {
        return errorResponse(
          403,
          `Upload limit reached. ${subscription.tier} tier allows ${uploadLimit} video(s) per month.`,
          'UPLOAD_LIMIT_REACHED',
          {
            limit: uploadLimit,
            used: uploadsThisMonth,
          }
        );
      }
    }

    // 4. Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return errorResponse(400, 'No video file provided', 'INVALID_REQUEST');
    }

    // 5. Validate file
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return errorResponse(400, 'File size exceeds 100MB limit', 'INVALID_FILE');
    }

    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse(400, 'Invalid file type. Allowed: MP4, MOV, AVI', 'INVALID_FILE');
    }

    // 6. Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 7. Upload to Supabase
    const { url } = await uploadVideo(buffer, file.name, student.id);

    // 8. Create database record
    const videoUpload = await createVideoUpload({
      studentId: student.id,
      fileName: file.name,
      fileUrl: url,
      fileSize: file.size,
      mimeType: file.type,
      status: 'UPLOADED',
    });

    // 9. Trigger best-effort async processing.
    void processVideoUpload(videoUpload.id).catch((error) => {
      console.error(`Video processing failed for ${videoUpload.id}:`, error);
    });

    return NextResponse.json({
      success: true,
      videoId: videoUpload.id,
      message: 'Video uploaded successfully. Processing will begin shortly.',
      video: {
        id: videoUpload.id,
        fileName: videoUpload.fileName,
        fileUrl: videoUpload.fileUrl,
        status: videoUpload.status,
        uploadedAt: videoUpload.uploadedAt,
      },
    });
  } catch (error) {
    console.error('Video upload error:', error);
    return errorResponse(
      500,
      error instanceof Error ? error.message : 'Failed to upload video',
      'SERVER_ERROR'
    );
  }
}
