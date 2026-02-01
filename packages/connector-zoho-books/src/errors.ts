// Error handling for Zoho Books API

import type { ZohoApiErrorResponse } from './types'

/**
 * Custom error class for Zoho Books connector
 */
export class ZohoConnectorError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public retryable: boolean = false,
    public zohoResponse?: ZohoApiErrorResponse
  ) {
    super(message)
    this.name = 'ZohoConnectorError'

    // Maintains proper stack trace for where error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZohoConnectorError)
    }
  }

  /**
   * Check if error is due to rate limiting
   */
  static isRateLimitError(error: unknown): error is ZohoConnectorError {
    return (
      error instanceof ZohoConnectorError &&
      (error.code === 'RATE_LIMIT' || error.statusCode === 429)
    )
  }

  /**
   * Check if error is due to authentication/authorization
   */
  static isAuthError(error: unknown): error is ZohoConnectorError {
    return (
      error instanceof ZohoConnectorError &&
      (error.code === 'UNAUTHORIZED' ||
       error.code === 'TOKEN_EXPIRED' ||
       error.statusCode === 401 ||
       error.statusCode === 403)
    )
  }

  /**
   * Check if error is retryable
   */
  static isRetryable(error: unknown): boolean {
    if (error instanceof ZohoConnectorError) {
      return error.retryable
    }
    return false
  }

  /**
   * Create error from Zoho API response
   */
  static fromZohoResponse(
    response: ZohoApiErrorResponse,
    statusCode: number
  ): ZohoConnectorError {
    const message = response.message || 'Unknown Zoho API error'
    let code = 'ZOHO_API_ERROR'
    let retryable = false

    // Map Zoho error codes to our codes
    if (statusCode === 401) {
      code = 'UNAUTHORIZED'
    } else if (statusCode === 403) {
      code = 'FORBIDDEN'
    } else if (statusCode === 429) {
      code = 'RATE_LIMIT'
      retryable = true
    } else if (statusCode >= 500) {
      code = 'SERVER_ERROR'
      retryable = true
    } else if (statusCode === 400) {
      code = 'VALIDATION_ERROR'
    }

    return new ZohoConnectorError(
      message,
      code,
      statusCode,
      retryable,
      response
    )
  }

  /**
   * Create error for missing organization
   */
  static orgNotRegistered(orgId: string): ZohoConnectorError {
    return new ZohoConnectorError(
      `Organization ${orgId} is not registered. Call registerZohoOrg() first.`,
      'ORG_NOT_REGISTERED',
      undefined,
      false
    )
  }

  /**
   * Create error for missing tokens
   */
  static tokensNotFound(orgId: string): ZohoConnectorError {
    return new ZohoConnectorError(
      `Tokens not found for organization ${orgId}. Call hydrateTokens() first.`,
      'TOKENS_NOT_FOUND',
      undefined,
      false
    )
  }

  /**
   * Create error for token refresh failure
   */
  static tokenRefreshFailed(orgId: string, reason: string): ZohoConnectorError {
    return new ZohoConnectorError(
      `Failed to refresh token for organization ${orgId}: ${reason}`,
      'TOKEN_REFRESH_FAILED',
      undefined,
      false
    )
  }

  /**
   * Create error for network issues
   */
  static networkError(message: string): ZohoConnectorError {
    return new ZohoConnectorError(
      `Network error: ${message}`,
      'NETWORK_ERROR',
      undefined,
      true
    )
  }
}
