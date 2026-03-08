import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/checkout/*',
          '/cart',
          '/account/*',
          '/verify',
          '/verify-email-address-change',
          '/password-reset',
          '/forgot-password',
          '/register',
          '/login',
          '/tracking',
          '/api/*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/checkout/*',
          '/cart',
          '/account/*',
          '/api/*'
        ],
      },
    ],
    sitemap: 'https://stalknspice.com/sitemap.xml',
  }
}
