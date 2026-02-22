/**
 * Utility functions for handling Vendure asset URLs
 */

/**
 * Transforms Vendure asset URLs to work correctly in the storefront
 * Supabase URLs work directly, no proxying needed
 */
export function getAssetUrl(assetUrl: string | undefined | null): string {
  // If no URL provided, use placeholder
  if (!assetUrl) {
    return '/images/sns-logo.png';
  }

  // Supabase URLs and other external URLs work directly
  return assetUrl;
}
