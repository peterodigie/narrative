/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/narrative',
  assetPrefix: '/narrative/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optional: Better debugging if needed
  reactStrictMode: true,
};

module.exports = nextConfig;
