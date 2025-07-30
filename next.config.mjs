/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['45.79.205.240'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '45.79.205.240',
        port: '',
        pathname: '/storage/**',
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig
