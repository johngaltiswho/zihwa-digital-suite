const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@repo/ui',
    '@repo/db',
    '@repo/doc-ingest',
    '@repo/connector-zoho-books',
    '@repo/ledger-core',
  ],
  serverExternalPackages: ['@prisma/client', 'prisma'],
  outputFileTracingIncludes: {
    '/*': [
      './prisma/generated/client/**',
      '../../packages/db/prisma/generated/client/**',
      '../../node_modules/.pnpm/@prisma+client*/node_modules/@prisma/client/**',
      '../../node_modules/.pnpm/prisma@*/node_modules/prisma/**',
      '../../node_modules/.pnpm/@prisma+engines@*/node_modules/@prisma/engines/**',
    ],
  },
  outputFileTracingRoot: path.join(__dirname, '../../'),
  typedRoutes: false,
}

module.exports = nextConfig
