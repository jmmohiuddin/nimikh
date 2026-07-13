import type { NextConfig } from 'next';
import { getRedirects } from './lib/redirects';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  compress: true,

  async redirects() {
    // Next's Redirect type is a discriminated union: use `permanent` OR
    // `statusCode`, never both. An explicit statusCode overrides.
    return getRedirects().map((r) =>
      r.statusCode !== undefined
        ? { source: r.source, destination: r.destination, statusCode: r.statusCode }
        : { source: r.source, destination: r.destination, permanent: r.permanent },
    );
  },
};

export default nextConfig;
