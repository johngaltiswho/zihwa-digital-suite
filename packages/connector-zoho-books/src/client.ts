// HTTP client for Zoho Books API

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios'
import type { ZohoRegion, ZohoApiErrorResponse } from './types'
import { ZohoConnectorError } from './errors'

/**
 * Configuration for retry logic
 */
interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
}

/**
 * Zoho Books API client with automatic retry logic
 */
export class ZohoBooksClient {
  private axiosInstance: AxiosInstance
  private retryConfig: RetryConfig

  constructor(
    private orgId: string,
    private accessToken: string,
    private region: ZohoRegion = 'in',
    retryConfig?: Partial<RetryConfig>
  ) {
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig }

    this.axiosInstance = axios.create({
      baseURL: this.getBaseUrl(),
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    })

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    )
  }

  /**
   * Get Zoho Books API base URL based on region
   */
  private getBaseUrl(): string {
    return `https://www.zohoapis.${this.region}/books/v3`
  }

  /**
   * Handle Axios errors and convert to ZohoConnectorError
   */
  private handleError(error: AxiosError): never {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const data = error.response.data as ZohoApiErrorResponse

      throw ZohoConnectorError.fromZohoResponse(data, status)
    } else if (error.request) {
      // Request was made but no response received
      throw ZohoConnectorError.networkError('No response from Zoho Books API')
    } else {
      // Something else happened
      throw ZohoConnectorError.networkError(error.message)
    }
  }

  /**
   * Calculate exponential backoff delay with jitter
   */
  private calculateBackoff(attempt: number): number {
    const exponentialDelay = this.retryConfig.baseDelay * Math.pow(2, attempt)
    const jitter = Math.random() * 1000 // Random 0-1 second jitter
    const delay = Math.min(exponentialDelay + jitter, this.retryConfig.maxDelay)
    return delay
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Make HTTP request with automatic retry logic
   */
  private async requestWithRetry<T>(
    config: AxiosRequestConfig,
    attempt = 0
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>(config)
      return response.data
    } catch (error) {
      // Check if error is retryable
      if (
        ZohoConnectorError.isRetryable(error) &&
        attempt < this.retryConfig.maxRetries
      ) {
        // Calculate backoff delay
        let delay = this.calculateBackoff(attempt)

        // If rate limit error, use Retry-After header if available
        if (
          ZohoConnectorError.isRateLimitError(error) &&
          error instanceof ZohoConnectorError
        ) {
          // Zoho may send Retry-After header (not always)
          // For now, use exponential backoff
        }

        // Wait before retrying
        await this.sleep(delay)

        // Retry
        return this.requestWithRetry<T>(config, attempt + 1)
      }

      // Not retryable or max retries reached
      throw error
    }
  }

  /**
   * GET request
   */
  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.requestWithRetry<T>({
      method: 'GET',
      url: path,
      params: {
        organization_id: this.orgId,
        ...params,
      },
    })
  }

  /**
   * POST request
   */
  async post<T>(
    path: string,
    data?: unknown,
    config?: Partial<AxiosRequestConfig>
  ): Promise<T> {
    return this.requestWithRetry<T>({
      method: 'POST',
      url: path,
      params: {
        organization_id: this.orgId,
      },
      data,
      ...config,
    })
  }

  /**
   * PUT request
   */
  async put<T>(
    path: string,
    data?: unknown,
    config?: Partial<AxiosRequestConfig>
  ): Promise<T> {
    return this.requestWithRetry<T>({
      method: 'PUT',
      url: path,
      params: {
        organization_id: this.orgId,
      },
      data,
      ...config,
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(path: string): Promise<T> {
    return this.requestWithRetry<T>({
      method: 'DELETE',
      url: path,
      params: {
        organization_id: this.orgId,
      },
    })
  }

  /**
   * Update access token (useful after token refresh)
   */
  updateAccessToken(newAccessToken: string): void {
    this.accessToken = newAccessToken
    this.axiosInstance.defaults.headers['Authorization'] =
      `Zoho-oauthtoken ${newAccessToken}`
  }
}
