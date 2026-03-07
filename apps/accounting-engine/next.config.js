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
      '../../packages/db/prisma/generated/client/libquery_engine-rhel-openssl-3.0.x.so.node',
    ],
  },
  outputFileTracingRoot: path.join(__dirname, '../../'),
  typedRoutes: false,
}

module.exports = nextConfig
