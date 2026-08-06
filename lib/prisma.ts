import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

interface CloudflareEnv {
  DB?: D1Database
}

// Detecta se está rodando no Cloudflare Pages (com binding D1)
function getCloudflareEnv(): CloudflareEnv | null {
  if (typeof globalThis !== 'undefined' && (globalThis as any).DB) {
    return { DB: (globalThis as any).DB }
  }
  return null
}

function createClient() {
  const cfEnv = getCloudflareEnv()

  if (cfEnv?.DB) {
    // Cloudflare D1 - edge runtime
    // O adapter é carregado dinamicamente para não quebrar em dev local
    const { PrismaD1 } = require('@prisma/adapter-d1')
    const adapter = new PrismaD1(cfEnv.DB)
    return new PrismaClient({ adapter })
  }

  // Dev local ou produção sem D1: usa SQLite padrão
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma