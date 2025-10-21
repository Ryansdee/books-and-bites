/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
  // Empêcher le prerendering des routes API
  experimental: {
    dynamicIO: true,
  },
};

module.exports = nextConfig;