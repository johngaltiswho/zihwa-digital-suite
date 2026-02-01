/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/db', '@repo/doc-ingest', '@repo/connector-zoho-books', '@repo/ledger-core'],
}

module.exports = nextConfig
