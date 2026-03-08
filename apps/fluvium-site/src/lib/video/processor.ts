import {
  createVideoAnalysis,
  getVideoUploadById,
  listVideoAnalyses,
  updateVideoUploadStatus,
} from '@repo/db';

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function toScore(seed: number, min = 70, max = 95): number {
  const range = max - min + 1;
  return min + (seed % range);
}

function buildFeedback(formScore: number, positioningScore: number): {
  feedback: string;
  strengths: string[];
  improvements: string[];
} {
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (formScore >= 85) strengths.push('Strong movement mechanics');
  else improvements.push('Focus on tighter movement mechanics');

  if (positioningScore >= 85) strengths.push('Good positional control');
  else improvements.push('Improve base and positional stability');

  if (strengths.length === 0) strengths.push('Consistent effort throughout the sequence');
  if (improvements.length === 0) improvements.push('Keep refining transitions under pressure');

  return {
    feedback:
      formScore >= 85 && positioningScore >= 85
        ? 'Solid execution overall with clean mechanics and control.'
        : 'Good baseline. Continue drilling details for cleaner execution.',
    strengths,
    improvements,
  };
}

export async function processVideoUpload(videoId: string): Promise<void> {
  const video = await getVideoUploadById(videoId);
  if (!video) {
    throw new Error(`Video ${videoId} not found`);
  }

  if (video.status === 'COMPLETED') {
    return;
  }

  await updateVideoUploadStatus(videoId, 'PROCESSING', {
    processingStartedAt: new Date(),
  });

  try {
    const existingAnalyses = await listVideoAnalyses(videoId);
    if (existingAnalyses.length === 0) {
      const base = hashString(`${video.id}:${video.fileName}:${video.fileSize}`);

      for (let frameNumber = 1; frameNumber <= 3; frameNumber += 1) {
        const frameSeed = base + frameNumber * 97;
        const formScore = toScore(frameSeed);
        const positioningScore = toScore(frameSeed + 31);
        const { feedback, strengths, improvements } = buildFeedback(formScore, positioningScore);

        await createVideoAnalysis({
          videoId: video.id,
          frameNumber,
          timestamp: frameNumber * 5,
          // MVP frame reference; can be replaced with extracted frame URLs in a future pass.
          frameUrl: `${video.fileUrl}#t=${frameNumber * 5}`,
          analysisType: 'TECHNIQUE_FORM',
          formScore,
          positioningScore,
          feedback,
          strengths,
          improvements,
          metadata: {
            processor: 'mvp-v1',
            frameSource: 'video-timestamp-reference',
          },
        });
      }
    }

    await updateVideoUploadStatus(videoId, 'COMPLETED', {
      processingCompletedAt: new Date(),
    });
  } catch (error) {
    await updateVideoUploadStatus(videoId, 'FAILED', {
      processingCompletedAt: new Date(),
    });
    throw error;
  }
}
