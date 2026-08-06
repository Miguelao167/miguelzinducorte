import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helper'

// GET - Carregar configurações PIX
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const config = await prisma.pixConfig.findUnique({
      where: { userId: user.id }
    })

    return NextResponse.json({ config })
  } catch (error) {
    console.error('Erro ao carregar config:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST - Salvar configurações PIX
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { chavePix, tipoChave, nomeRecebedor, cidade } = body

    if (!chavePix || !tipoChave || !nomeRecebedor || !cidade) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    const config = await prisma.pixConfig.upsert({
      where: { userId: user.id },
      update: {
        chavePix,
        tipoChave,
        nomeRecebedor: nomeRecebedor.toUpperCase(),
        cidade: cidade.toUpperCase(),
      },
      create: {
        userId: user.id,
        chavePix,
        tipoChave,
        nomeRecebedor: nomeRecebedor.toUpperCase(),
        cidade: cidade.toUpperCase(),
      },
    })

    return NextResponse.json({ config, success: true })
  } catch (error) {
    console.error('Erro ao salvar config:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}