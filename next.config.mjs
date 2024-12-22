/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      ;(config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: false,
        crypto: false,
        'cloudflare:sockets': false,
        fs: false,
        tls: false,
        net: false,
      }),
        config.externals.push('pino-pretty', 'encoding')
    }

    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  ignoreRoutes: ['/public'], // Add any other static asset paths you want to ignore
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
