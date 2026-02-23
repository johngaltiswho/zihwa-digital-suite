import { GraphQLClient } from 'graphql-request';

/**
 * The Vendure Channel Token.
 * It is prioritized from the .env file, with a fallback to 'stalks-n-spice'.
 */
const VENDURE_CHANNEL_TOKEN =
  process.env.NEXT_PUBLIC_VENDURE_CHANNEL_TOKEN || 'stalks-n-spice';

// Get the Vendure Shop API URL from environment variables
// Use the proxied path for browser requests to avoid CORS issues in Safari
const VENDURE_SHOP_API_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}/api/vendure/shop-api` // Use proxy in browser with absolute URL
    : process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL || 'http://localhost:3100/shop-api'; // Direct URL for SSR

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
export const handleGraphQLError = (error: any): string => {
  if (error.response?.errors) {
    return error.response.errors[0]?.message || 'An error occurred';
  }
  return error.message || 'An unexpected error occurred';
};