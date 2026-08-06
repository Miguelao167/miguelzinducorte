/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removido output: 'export' para permitir rotas dinâmicas (login, banco)
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  reactStrictMode: true,
}

module.exports = nextConfig