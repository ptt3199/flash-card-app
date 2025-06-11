/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    domains: ['img.clerk.com'],
  },
  // Disable static optimization for auth-dependent pages
  experimental: {
    esmExternals: true,
  },
};

module.exports = nextConfig; 