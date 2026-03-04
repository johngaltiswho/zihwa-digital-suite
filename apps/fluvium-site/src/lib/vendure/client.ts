import { GraphQLClient } from 'graphql-request';

/**
 * The Vendure Channel Token.
 * It is prioritized from the .env file, with a fallback to 'fluvium'.
 */
const VENDURE_CHANNEL_TOKEN =
  process.env.NEXT_PUBLIC_VENDURE_CHANNEL_TOKEN || 'fluvium';

// Get the Vendure Shop API URL from environment variables
const VENDURE_SHOP_API_URL =
  process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL || 'http://localhost:3100/shop-api';

console.log('USING VENDURE CHANNEL TOKEN:', VENDURE_CHANNEL_TOKEN);

/**
 * Default GraphQL client for Vendure Shop API
 * Includes credentials for cookie-based session management
 */
export const vendureClient = new GraphQLClient(VENDURE_SHOP_API_URL, {
  credentials: 'include', // Important: Send cookies for session management
  headers: {
    'Content-Type': 'application/json',
    'vendure-token': VENDURE_CHANNEL_TOKEN,
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
      'vendure-token': VENDURE_CHANNEL_TOKEN,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

/**
 * Helper function to handle GraphQL errors consistently
 */
export const handleGraphQLError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const graphQLError = error as { response?: { errors?: Array<{ message?: string }> } };
    if (graphQLError.response?.errors) {
      return graphQLError.response.errors[0]?.message || 'An error occurred';
    }
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message) || 'An unexpected error occurred';
  }
  return 'An unexpected error occurred';
};
