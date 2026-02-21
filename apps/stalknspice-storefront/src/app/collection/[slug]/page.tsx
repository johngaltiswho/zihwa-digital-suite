'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Legacy Collection Page - Redirects to Unified Shop
 *
 * This page now redirects all /collection/[slug] URLs to /shop?collection=[slug]
 * for a unified marketplace experience.
 */
export default function CollectionRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  useEffect(() => {
    if (slug) {
      // Redirect to unified shop page with collection query param
      router.replace(`/shop?collection=${slug}`);
    } else {
      // Fallback to shop page if no slug
      router.replace('/shop');
    }
  }, [slug, router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="animate-spin text-[#8B2323]" size={32} />
      <p className="text-sm text-gray-500 font-medium">Redirecting to shop...</p>
    </div>
  );
}
