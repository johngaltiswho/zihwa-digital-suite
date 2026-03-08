import { NextResponse } from 'next/server';

export type ApiErrorCode =
  | 'AUTH_REQUIRED'
  | 'SUBSCRIPTION_REQUIRED'
  | 'UPLOAD_LIMIT_REACHED'
  | 'INVALID_FILE'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'SERVER_ERROR'
  | 'INVALID_REQUEST';

export function errorResponse(
  status: number,
  error: string,
  code: ApiErrorCode,
  details?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    {
      error,
      code,
      ...(details ? { details } : {}),
    },
    { status }
  );
}
