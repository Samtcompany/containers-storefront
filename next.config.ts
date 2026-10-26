import type { NextConfig } from 'next';

/**
 * Two builds from one source. LIVE (default): server-rendered on demand from Aamer. SNAPSHOT
 * (`STOREFRONT_SNAPSHOT=1`): a static export of one captured document, with relative asset paths,
 * so the site can be previewed from any static host without Aamer — `npm run snapshot`.
 */
const snapshot = process.env.STOREFRONT_SNAPSHOT === '1';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(snapshot ? { output: 'export', trailingSlash: true, assetPrefix: './', images: { unoptimized: true } } : {}),
};

export default nextConfig;
