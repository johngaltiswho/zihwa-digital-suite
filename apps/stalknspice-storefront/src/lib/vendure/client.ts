import { GraphQLClient } from 'graphql-request';

// Get the Vendure Shop API URL from environment variables
const VENDURE_SHOP_API_URL =
  process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL || 'http://localhost:3002/shop-api';

/**
 * Default GraphQL client for Vendure Shop API
 * Includes credentials for cookie-based session management
 */
export const vendureClient = new GraphQLClient(VENDURE_SHOP_API_URL, {
  credentials: 'include', // Important: Send cookies for session management
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get an authenticated GraphQL client with optional Bearer token
 * Used for requests that require additional authentication
 */
export const getAuthenticatedClient = (token?: string) => {
  return new GraphQLClient(VENDURE_SHOP_API_URL, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

/**
 * Helper function to handle GraphQL errors consistently
 */
export const handleGraphQLError = (error: any): string => {
  if (error.response?.errors) {
    return error.response.errors[0]?.message || 'An error occurred';
  }
  return error.message || 'An unexpected error occurred';
};
