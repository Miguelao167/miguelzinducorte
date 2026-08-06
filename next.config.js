/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  reactStrictMode: true,
  // Permitir build em ambiente edge (Cloudflare Pages)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Não tentar resolver módulos nativos do Node no bundle do cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig